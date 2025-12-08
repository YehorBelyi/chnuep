from sqlalchemy import select, update, desc
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from database.models import Notification
from repositories.base import BaseRepository

class NotificationRepository(BaseRepository[Notification]):
    def __init__(self, session: AsyncSession):
        super().__init__(Notification, session)

    async def get_user_notifications(self, user_id: int, limit: int = 50) -> List[Notification]:
        query = (
            select(Notification)
            .where(Notification.user_id == user_id)
            .order_by(desc(Notification.created_at))
            .limit(limit)
        )
        result = await self.session.execute(query)
        return result.scalars().all()

    async def mark_as_read(self, notification_id: int):
        query = (
            update(Notification)
            .where(Notification.id == notification_id)
            .values(is_read=True)
        )
        await self.session.execute(query)