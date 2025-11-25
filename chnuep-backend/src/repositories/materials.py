from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from database.models import Material
from repositories.base import BaseRepository

class MaterialRepository(BaseRepository[Material]):
    def __init__(self, session: AsyncSession):
        super().__init__(Material, session)

    async def get_by_course(self, course_id: int) -> List[Material]:
        query = select(Material).where(Material.course_id == course_id)
        result = await self.session.execute(query)
        return result.scalars().all()