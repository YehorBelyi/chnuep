print("-----------------> COURSES ROUTER LOADED <-----------------")

from fastapi import APIRouter, Depends, status, HTTPException
from typing import List

from schemas.courses import CourseCreateSchema, CourseResponseSchema
from api.dependencies import (
    CourseRepoDependency,
    TeacherUserDependency,
    CurrentUserDependency
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
        user: TeacherUserDependency  # Only teachers can view their courses
):
    return await course_repo.get_by_teacher(user.id)


@router.get("/", response_model=List[CourseResponseSchema])
async def get_all_courses(course_repo: CourseRepoDependency):
    return await course_repo.get_all()

@router.get("/{course_id}", response_model=CourseResponseSchema)
async def get_course_details(
    course_id: int,
    course_repo: CourseRepoDependency
):
    course = await course_repo.get_by_id(course_id)
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    return course