from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from database.models import Assignment
from repositories.base import BaseRepository

class AssignmentRepository(BaseRepository[Assignment]):
    def __init__(self, session: AsyncSession):
        super().__init__(Assignment, session)

    # Get assigment by specific year (1, 2)
    async def get_by_course(self, course_id: int) -> List[Assignment]:
        query = select(Assignment).where(Assignment.course_id == course_id)
        result = await self.session.execute(query)
        return result.scalars().all()