from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from database.models import Course
from repositories.base import BaseRepository
from typing import List

class CourseRepository(BaseRepository[Course]):
    def __init__(self, session: AsyncSession):
        super().__init__(Course, session)

    async def get_by_teacher(self, teacher_id: int) -> List[Course]:
        query = select(Course).where(Course.teacher_id == teacher_id)
        result = await self.session.execute(query)
        return result.scalars().all()