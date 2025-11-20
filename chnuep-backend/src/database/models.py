import enum
from datetime import datetime
from typing import List, Optional
from sqlalchemy import ForeignKey, String, Text, DateTime, Enum as SqEnum
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship
from sqlalchemy.sql import func

class Base(DeclarativeBase):
    pass

class UserRole(str, enum.Enum):
    STUDENT = "student"
    TEACHER = "teacher"
    ADMIN = "admin"

class Enrollment(Base):
    __tablename__ = "enrollments"
    student_id: Mapped[int] = mapped_column(ForeignKey("users.id"), primary_key=True)
    course_id: Mapped[int] = mapped_column(ForeignKey("courses.id"), primary_key=True)
    enrolled_at: Mapped[datetime] = mapped_column(default=func.now())

class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(150), unique=True, index=True)
    password_hash: Mapped[str] = mapped_column(String(255))
    full_name: Mapped[str] = mapped_column(String(100))
    role: Mapped[UserRole] = mapped_column(SqEnum(UserRole), default=UserRole.STUDENT)
    avatar_url: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)

    # Relationships
    courses_teaching: Mapped[List["Course"]] = relationship(back_populates="teacher")
    courses_enrolled: Mapped[List["Course"]] = relationship(
        secondary="enrollments", back_populates="students", lazy="selectin"
    )
    submissions: Mapped[List["Submission"]] = relationship(back_populates="student")

class Course(Base):
    __tablename__ = "courses"

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(200))
    description: Mapped[str] = mapped_column(Text)
    teacher_id: Mapped[int] = mapped_column(ForeignKey("users.id"))

    teacher: Mapped["User"] = relationship(back_populates="courses_teaching", lazy="joined")
    students: Mapped[List["User"]] = relationship(
        secondary="enrollments", back_populates="courses_enrolled", lazy="selectin"
    )
    assignments: Mapped[List["Assignment"]] = relationship(back_populates="course", cascade="all, delete-orphan")

class Assignment(Base):
    __tablename__ = "assignments"

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(200))
    description: Mapped[str] = mapped_column(Text)
    course_id: Mapped[int] = mapped_column(ForeignKey("courses.id"))
    max_grade: Mapped[int] = mapped_column(default=100)
    due_date: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)

    course: Mapped["Course"] = relationship(back_populates="assignments")
    submissions: Mapped[List["Submission"]] = relationship(back_populates="assignment")

class Submission(Base):
    __tablename__ = "submissions"

    id: Mapped[int] = mapped_column(primary_key=True)
    student_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    assignment_id: Mapped[int] = mapped_column(ForeignKey("assignments.id"))
    file_url: Mapped[str] = mapped_column(String(500))
    student_comment: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    grade: Mapped[Optional[int]] = mapped_column(nullable=True)
    teacher_comment: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    submitted_at: Mapped[datetime] = mapped_column(default=func.now())
    status: Mapped[str] = mapped_column(String(50), default="submitted")

    student: Mapped["User"] = relationship(back_populates="submissions")
    assignment: Mapped["Assignment"] = relationship(back_populates="submissions")