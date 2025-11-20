from sqlalchemy import select, delete
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from database.models import Enrollment, Course, User
from repositories.base import BaseRepository


class EnrollmentRepository(BaseRepository[Enrollment]):
    def __init__(self, session: AsyncSession):
        super().__init__(Enrollment, session)

    # Check if user is enrolled for this course
    async def is_enrolled(self, student_id: int, course_id: int) -> bool:
        query = select(Enrollment).where(
            Enrollment.student_id == student_id,
            Enrollment.course_id == course_id
        )
        result = await self.session.execute(query)
        return result.scalars().first() is not None

    # Get students course IDs
    async def get_student_courses(self, student_id: int) -> List[Course]:
        query = (
            select(Course)
            .join(Enrollment, Course.id == Enrollment.course_id)
            .where(Enrollment.student_id == student_id)
        )
        result = await self.session.execute(query)
        return result.scalars().all()

    # Unenroll from course
    async def unenroll(self, student_id: int, course_id: int):
        query = delete(Enrollment).where(
            Enrollment.student_id == student_id,
            Enrollment.course_id == course_id
        )
        await self.session.execute(query)

    async def get_students_by_course(self, course_id: int) -> List[User]:
        query = (
            select(User)
            .join(Enrollment, User.id == Enrollment.student_id)
            .where(Enrollment.course_id == course_id)
        )
        result = await self.session.execute(query)
        return result.scalars().all()