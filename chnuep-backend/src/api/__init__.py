from fastapi import APIRouter

from . import authorization, courses, assignments, submissions, enrollments, materials, users, grades

main_router = APIRouter()
main_router.include_router(authorization.router, tags=["authorization"])
main_router.include_router(courses.router, prefix="/courses", tags=["courses"])
main_router.include_router(assignments.router, prefix="/assignments", tags=["assignments"])
main_router.include_router(submissions.router, prefix="/submissions", tags=["submissions"])
main_router.include_router(enrollments.router, prefix="/enrollments", tags=["enrollments"])
main_router.include_router(materials.router, prefix="/materials", tags=["materials"])
main_router.include_router(users.router, prefix="/users", tags=["users"])
main_router.include_router(grades.router, prefix="/grades", tags=["grades"])