from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class SubmissionResponseSchema(BaseModel):
    id: int
    student_id: int
    assignment_id: int
    file_url: str
    student_comment: Optional[str] = None
    grade: Optional[int] = None
    submitted_at: datetime

    class Config:
        from_attributes = True