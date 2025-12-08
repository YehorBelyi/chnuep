from pydantic import BaseModel
from typing import Optional
from schemas.auth import UserResponseSchema

class CourseCreateSchema(BaseModel):
    title: str
    description: str

class CourseResponseSchema(BaseModel):
    id: int
    title: str
    description: str
    teacher_id: int

    teacher: Optional[UserResponseSchema] = None

    class Config:
        from_attributes = True

class CourseUpdateSchema(BaseModel):
    title: str
    description: str