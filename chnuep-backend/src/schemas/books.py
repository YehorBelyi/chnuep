from pydantic import BaseModel

class BookCreateSchema(BaseModel):
    title: str
    author: str

class BookSchema(BookCreateSchema):
    id: int