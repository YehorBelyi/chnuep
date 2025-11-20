from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from database.models import User, UserRole
from repositories.base import BaseRepository

class UserRepository(BaseRepository[User]):
    def __init__(self, session: AsyncSession):
        super().__init__(User, session)

    async def get_by_email(self, email: str) -> User | None:
        query = select(User).where(User.email == email)
        result = await self.session.execute(query)
        return result.scalars().one_or_none()

    async def get_all_students(self) -> list[User]:
        query = select(User).where(User.role == UserRole.STUDENT)
        result = await self.session.execute(query)
        return result.scalars().all()