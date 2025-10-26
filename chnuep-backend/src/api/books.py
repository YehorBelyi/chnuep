from fastapi import APIRouter
from sqlalchemy import select

from api.dependencies import SessionDependency
from database.engine import setup_databse, engine
from database.models import BookModel
from schemas.books import BookCreateSchema

router = APIRouter()

@router.get("/")
def root():
    return "Hello World"

@router.post("/setup_database", summary="Setup database")
async def setup_database():
    await setup_databse()
    return {"status": "ok"}

@router.on_event("shutdown")
async def on_shutdown():
    await engine.dispose()


@router.post("/books")
async def add_book(data: BookCreateSchema, session: SessionDependency):
    new_book = BookModel(title=data.title, author=data.author)
    session.add(new_book)
    await session.commit()
    return {"ok": "True"}

@router.get("/books")
async def get_books(session: SessionDependency):
    query = select(BookModel)
    result = await session.execute(query)
    return result.scalars().all()