from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from database.models import Course
from repositories.base import BaseRepository
from typing import List

class CourseRepository(BaseRepository[Course]):
    def __init__(self, session: AsyncSession):
        super().__init__(Course, session)

    async def get_by_id(self, id: int) -> Course | None:
        query = select(Course).options(selectinload(Course.teacher)).where(Course.id == id)
        result = await self.session.execute(query)
        return result.scalars().first()

    async def get_by_teacher(self, teacher_id: int) -> List[Course]:
        query = select(Course).options(selectinload(Course.teacher)).where(Course.teacher_id == teacher_id)
        result = await self.session.execute(query)
        return result.scalars().all()

    async def get_all(self) -> List[Course]:
        query = select(Course).options(selectinload(Course.teacher))
        result = await self.session.execute(query)
        return result.scalars().all()

    async def delete_course(self, course_id: int):
        await self.delete(course_id)