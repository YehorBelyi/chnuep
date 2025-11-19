from typing import Generic, TypeVar, Type, List, Optional, Any
from sqlalchemy import select, update, delete
from sqlalchemy.ext.asyncio import AsyncSession
from database.models import Base

ModelType = TypeVar("ModelType", bound=Base)

class BaseRepository(Generic[ModelType]):
    def __init__(self, model: Type[ModelType], session: AsyncSession):
        self.model = model
        self.session = session

    async def create(self, attributes: dict) -> ModelType:
        obj = self.model(**attributes)
        self.session.add(obj)
        await self.session.flush()
        await self.session.refresh(obj)
        return obj

    async def get_all(self, skip: int = 0, limit: int = 100) -> List[ModelType]:
        query = select(self.model).offset(skip).limit(limit)
        result = await self.session.execute(query)
        return result.scalars().all()

    async def get_by_id(self, model_id: int) -> Optional[ModelType]:
        query = select(self.model).where(self.model.id == model_id)
        result = await self.session.execute(query)
        return result.scalars().one_or_none()

    async def update(self, model_id: int, attributes: dict) -> Optional[ModelType]:
        query = (
            update(self.model)
            .where(self.model.id == model_id)
            .values(**attributes)
            .execution_options(synchronize_session="fetch")
        )
        await self.session.execute(query)
        return await self.get_by_id(model_id)

    async def delete(self, model_id: int) -> bool:
        query = delete(self.model).where(self.model.id == model_id)
        result = await self.session.execute(query)
        return result.rowcount > 0