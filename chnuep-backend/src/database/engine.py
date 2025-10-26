from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from database.models import Base
from config import settings

engine = create_async_engine(settings.DB_URL, echo=True)

# Bind - expecting our engine, class - AsyncSession, expire_in_commit - using session repetitively unless it closes
new_session = async_sessionmaker(bind=engine, class_=AsyncSession, expire_on_commit=False)

async def get_session():
    async with new_session() as session:
        yield session

async def setup_databse():
    async with engine.begin() as connection:
        await connection.run_sync(Base.metadata.drop_all)
        await connection.run_sync(Base.metadata.create_all)