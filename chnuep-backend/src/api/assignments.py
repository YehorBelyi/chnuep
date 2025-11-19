from fastapi import APIRouter, Depends, status, HTTPException
from typing import List

from schemas.assignments import AssignmentCreateSchema, AssignmentResponseSchema
from api.dependencies import (
    AssignmentRepoDependency,
    CourseRepoDependency,
    TeacherUserDependency,
    CurrentUserDependency
)

router = APIRouter()


@router.post("/", response_model=AssignmentResponseSchema, status_code=status.HTTP_201_CREATED)
async def create_assignment(
        data: AssignmentCreateSchema,
        assignment_repo: AssignmentRepoDependency,
        course_repo: CourseRepoDependency,
        user: TeacherUserDependency
):
    # Check whether course exists
    course = await course_repo.get_by_id(data.course_id)
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")

    if course.teacher_id != user.id:
        raise HTTPException(status_code=403, detail="You are not the teacher of this course")

    assignment_data = data.model_dump()

    # Data formatting for correct database input
    if assignment_data.get("due_date"):
        assignment_data["due_date"] = assignment_data["due_date"].replace(tzinfo=None)

    new_assignment = await assignment_repo.create(assignment_data)

    await assignment_repo.session.commit()
    return new_assignment


@router.get("/course/{course_id}", response_model=List[AssignmentResponseSchema])
async def get_course_assignments(
        course_id: int,
        assignment_repo: AssignmentRepoDependency,
        user: CurrentUserDependency  # Students also can view tasks
):
    return await assignment_repo.get_by_course(course_id)