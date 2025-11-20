from database.models import UserRole

print("-----------------> COURSES ROUTER LOADED <-----------------")

from fastapi import APIRouter, Depends, status, HTTPException
from typing import List

from schemas.courses import CourseCreateSchema, CourseResponseSchema
from api.dependencies import (
    CourseRepoDependency,
    TeacherUserDependency,
    CurrentUserDependency, EnrollmentRepoDependency
)

router = APIRouter()


@router.post("/", response_model=CourseResponseSchema, status_code=status.HTTP_201_CREATED)
async def create_course(
        course_data: CourseCreateSchema,
        course_repo: CourseRepoDependency,
        user: TeacherUserDependency
):
    new_course_data = course_data.model_dump()
    new_course_data["teacher_id"] = user.id

    new_course = await course_repo.create(new_course_data)
    await course_repo.session.commit()

    return new_course


@router.get("/my", response_model=List[CourseResponseSchema])
async def get_my_courses(
        course_repo: CourseRepoDependency,
        enrollment_repo: EnrollmentRepoDependency,
        user: CurrentUserDependency
):
    # Admin: can view all existing courses
    if user.role == UserRole.ADMIN:
        return await course_repo.get_all()

    # Teacher: can view only their courses
    elif user.role == UserRole.TEACHER:
        return await course_repo.get_by_teacher(user.id)

    # Student: can view courses their are enrolled for
    else:
        return await enrollment_repo.get_student_courses(user.id)


@router.get("/", response_model=List[CourseResponseSchema])
async def get_all_courses(course_repo: CourseRepoDependency):
    return await course_repo.get_all()


@router.get("/{course_id}", response_model=CourseResponseSchema)
async def get_course_details(
        course_id: int,
        course_repo: CourseRepoDependency,
        enrollment_repo: EnrollmentRepoDependency,
        user: CurrentUserDependency
):
    course = await course_repo.get_by_id(course_id)
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")

    # Admin can view everything
    if user.role == UserRole.ADMIN:
        return course

    # Teacher can view own courses
    if user.role == UserRole.TEACHER:
        if course.teacher_id != user.id:
            raise HTTPException(status_code=403, detail="You do not have access to this course")
        return course

    # Student sees only courses where he/she is enrolled
    if user.role == UserRole.STUDENT:
        is_enrolled = await enrollment_repo.is_enrolled(user.id, course_id)
        if not is_enrolled:
            raise HTTPException(status_code=403, detail="You are not enrolled in this course")
        return course

    return course