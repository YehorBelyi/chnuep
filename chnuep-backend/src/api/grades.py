from fastapi import APIRouter, Depends
from typing import List, Optional
from pydantic import BaseModel
from sqlalchemy import select
from api.dependencies import CurrentUserDependency, SessionDependency
from database.models import Submission, Assignment, Course

router = APIRouter()


# Scheme for single assignment
class GradeAssignmentSchema(BaseModel):
    assignment_id: int
    title: str
    grade: Optional[int]
    max_grade: int
    teacher_comment: Optional[str] = None


# Schema for entire course
class CourseGradeSchema(BaseModel):
    course_id: int
    course_title: str
    total_grade: int  # Total grade
    total_max_grade: int  # Grade you can get during course
    assignments: List[GradeAssignmentSchema]


@router.get("/my", response_model=List[CourseGradeSchema])
async def get_my_grades(
        user: CurrentUserDependency,
        session: SessionDependency
):
    query = (
        select(Submission, Assignment, Course)
        .join(Assignment, Submission.assignment_id == Assignment.id)
        .join(Course, Assignment.course_id == Course.id)
        .where(Submission.student_id == user.id)
    )
    result = await session.execute(query)

    # Dictionary to group data
    courses_map = {}

    for submission, assignment, course in result:
        if course.id not in courses_map:
            courses_map[course.id] = {
                "course_id": course.id,
                "course_title": course.title,
                "total_grade": 0,
                "total_max_grade": 0,
                "assignments": []
            }

        # Adding data about assignment
        courses_map[course.id]["assignments"].append({
            "assignment_id": assignment.id,
            "title": assignment.title,
            "grade": submission.grade,
            "max_grade": assignment.max_grade,
            "teacher_comment": submission.teacher_comment
        })

        # Adding to sum only if assignment is marked
        if submission.grade is not None:
            courses_map[course.id]["total_grade"] += submission.grade

        courses_map[course.id]["total_max_grade"] += assignment.max_grade

    return list(courses_map.values())