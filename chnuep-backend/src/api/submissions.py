import os
import uuid
import shutil
from fastapi import APIRouter, Depends, status, HTTPException, UploadFile, File, Form
from typing import Optional, List

from sqlalchemy import select

from api.dependencies import (
    SubmissionRepoDependency,
    AssignmentRepoDependency,
    CurrentUserDependency,
    TeacherUserDependency, SessionDependency
)
from repositories.notifications import NotificationRepository
from schemas.submissions import SubmissionResponseSchema, SubmissionGradeSchema
from sqlalchemy.orm import selectinload
from repositories.courses import CourseRepository
from repositories.assignments import AssignmentRepository

from utils.websocket_manager import manager
from sqlalchemy import func, select
from database.models import Submission, Assignment, Course

router = APIRouter()

UPLOAD_DIR = "static/uploads"


@router.post("/{assignment_id}", response_model=SubmissionResponseSchema)
async def submit_assignment(
        assignment_id: int,
        submission_repo: SubmissionRepoDependency,
        assignment_repo: AssignmentRepoDependency,
        user: CurrentUserDependency,
        file: UploadFile = File(...),
        student_comment: Optional[str] = Form(None)
):
    # Check whether assignment exists
    assignment = await assignment_repo.get_by_id(assignment_id)
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")

    # Check whether student submitted his files
    existing = await submission_repo.get_by_assignment_and_student(assignment_id, user.id)
    if existing:
        raise HTTPException(status_code=400, detail="You have already submitted this assignment")

    # Saving files on the server
    # Generating unique name: uuid and file extensions
    file_ext = file.filename.split(".")[-1]
    new_filename = f"{uuid.uuid4()}.{file_ext}"
    file_path = os.path.join(UPLOAD_DIR, new_filename)

    # Writing file
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # URL to access the file on the server
    file_url = f"/static/uploads/{new_filename}"

    # Database object
    new_submission_data = {
        "student_id": user.id,
        "assignment_id": assignment_id,
        "file_url": file_url,
        "student_comment": student_comment,
        "grade": None,
        "status": "submitted"
    }

    submission = await submission_repo.create(new_submission_data)
    await submission_repo.session.commit()

    return submission


@router.get("/my/{assignment_id}", response_model=Optional[SubmissionResponseSchema])
async def get_my_submission(
        assignment_id: int,
        submission_repo: SubmissionRepoDependency,
        user: CurrentUserDependency
):
    return await submission_repo.get_by_assignment_and_student(assignment_id, user.id)


@router.get("/assignment/{assignment_id}", response_model=List[SubmissionResponseSchema])
async def get_all_submissions(
        assignment_id: int,
        submission_repo: SubmissionRepoDependency,
        assignment_repo: AssignmentRepoDependency,
        user: TeacherUserDependency  # Only teacher can do this
):
    # Check whether teacher owns this course
    assignment = await assignment_repo.get_by_id(assignment_id)
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")

    return await submission_repo.get_by_assignment(assignment_id)


@router.patch("/{submission_id}", response_model=SubmissionResponseSchema)
async def grade_submission(
        submission_id: int,
        grade_data: SubmissionGradeSchema,
        submission_repo: SubmissionRepoDependency,
        user: TeacherUserDependency,
):
    submission = await submission_repo.get_by_id(submission_id)
    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found")

    update_data = grade_data.model_dump()
    update_data["status"] = "graded"
    updated_submission = await submission_repo.update(submission_id, update_data)

    session = submission_repo.session
    notif_repo = NotificationRepository(session)
    assign_repo = AssignmentRepository(session)
    course_repo = CourseRepository(session)

    assignment = await assign_repo.get_by_id(submission.assignment_id)

    course = await course_repo.get_by_id(assignment.course_id)

    msg_text = f"{course.title}: Оцінено роботу '{assignment.title}' — {grade_data.grade} балів."

    new_notif = await notif_repo.create({
        "user_id": submission.student_id,
        "message": msg_text,
        "is_read": False
    })

    await manager.send_personal_message({
        "id": new_notif.id,
        "message": new_notif.message,
        "is_read": False,
        "created_at": new_notif.created_at.isoformat()
    }, user_id=submission.student_id)

    await submission_repo.session.commit()
    return updated_submission


@router.get("/pending/count", response_model=int)
async def get_pending_submissions_count(
        user: TeacherUserDependency,
        session: SessionDependency
):
    query = (
        select(func.count(Submission.id))
        .join(Assignment, Submission.assignment_id == Assignment.id)
        .join(Course, Assignment.course_id == Course.id)
        .where(Course.teacher_id == user.id)
        .where(Submission.grade == None)
    )

    result = await session.execute(query)
    count = result.scalar() or 0
    return count