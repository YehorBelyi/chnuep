import os
import uuid
import shutil
from fastapi import APIRouter, Depends, status, HTTPException, UploadFile, File, Form
from typing import Optional

from api.dependencies import (
    SubmissionRepoDependency,
    AssignmentRepoDependency,
    CurrentUserDependency
)
from schemas.submissions import SubmissionResponseSchema

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