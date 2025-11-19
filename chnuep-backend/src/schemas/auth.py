from pydantic import BaseModel, EmailStr
from typing import Optional
from database.models import UserRole

class UserLoginSchema(BaseModel):
    email: EmailStr
    password: str

class UserRegisterSchema(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    role: UserRole = UserRole.STUDENT

class UserResponseSchema(BaseModel):
    id: int
    email: EmailStr
    full_name: str
    role: UserRole
    avatar_url: Optional[str] = None

    class Config:
        from_attributes = True # Allows to read data from SQLAlchemy object