from fastapi import APIRouter

from . import authorization, courses, assignments

main_router = APIRouter()
main_router.include_router(authorization.router, tags=["authorization"])
main_router.include_router(courses.router, prefix="/courses", tags=["courses"])
main_router.include_router(assignments.router, prefix="/assignments", tags=["assignments"])