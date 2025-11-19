from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class AssignmentCreateSchema(BaseModel):
    title: str
    description: str
    max_grade: int = 100
    course_id: int
    due_date: Optional[datetime] = None

class AssignmentResponseSchema(BaseModel):
    id: int
    title: str
    description: str
    max_grade: int
    course_id: int
    due_date: Optional[datetime] = None

    class Config:
        from_attributes = True