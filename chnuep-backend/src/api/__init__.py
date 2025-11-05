from fastapi import APIRouter

from api import books, authorization

main_router = APIRouter()
main_router.include_router(books.router, tags=["books"])
main_router.include_router(authorization.router, tags=["authorization"])