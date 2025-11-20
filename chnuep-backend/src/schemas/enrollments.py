from pydantic import BaseModel

class EnrollmentCreateSchema(BaseModel):
    student_id: int
    course_id: int

class EnrollmentResponseSchema(BaseModel):
    student_id: int
    course_id: int