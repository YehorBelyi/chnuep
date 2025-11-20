from pydantic import BaseModel
from datetime import datetime
from typing import Optional
# Importing user schema to get his fullname
from schemas.auth import UserResponseSchema

# Schema to mark users submission
class SubmissionGradeSchema(BaseModel):
    grade: int
    teacher_comment: Optional[str] = None

class SubmissionResponseSchema(BaseModel):
    id: int
    student_id: int
    assignment_id: int
    file_url: str
    student_comment: Optional[str] = None
    grade: Optional[int] = None
    submitted_at: datetime

    # To mark students submissions and to get info about him
    student: Optional[UserResponseSchema] = None

    class Config:
        from_attributes = True