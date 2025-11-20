from fastapi import APIRouter, HTTPException, status, Depends
from typing import List

from api.dependencies import (
    EnrollmentRepoDependency,
    CourseRepoDependency,
    UserRepoDependency,
    verify_admin_role, # Only admin
    CurrentUserDependency,
    AdminUserDependency
)
from schemas.enrollments import EnrollmentCreateSchema
from schemas.auth import UserResponseSchema

router = APIRouter()


# Enroll students for this course (Only admin can do this)
@router.post("/", status_code=status.HTTP_201_CREATED)
async def enroll_student(
        data: EnrollmentCreateSchema,
        enrollment_repo: EnrollmentRepoDependency,
        course_repo: CourseRepoDependency,
        user_repo: UserRepoDependency,
        admin: AdminUserDependency
):
    # Check whether course exists
    course = await course_repo.get_by_id(data.course_id)
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")

    student = await user_repo.get_by_id(data.student_id)
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    # Check if the user is already enrolled
    if await enrollment_repo.is_enrolled(data.student_id, data.course_id):
        raise HTTPException(status_code=400, detail="Student is already enrolled in this course")

    # Enrolling
    await enrollment_repo.create(data.model_dump())
    await enrollment_repo.session.commit()

    return {"message": "Student enrolled successfully"}


# Get list of students on this course
@router.get("/{course_id}/students", response_model=List[UserResponseSchema])
async def get_course_students(
        course_id: int,
        enrollment_repo: EnrollmentRepoDependency,
        user: CurrentUserDependency
):
    return await enrollment_repo.get_students_by_course(course_id)