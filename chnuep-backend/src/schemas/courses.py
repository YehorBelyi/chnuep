from pydantic import BaseModel
from typing import Optional

class CourseCreateSchema(BaseModel):
    title: str
    description: str

class CourseResponseSchema(BaseModel):
    id: int
    title: str
    description: str
    teacher_id: int

    class Config:
        from_attributes = True