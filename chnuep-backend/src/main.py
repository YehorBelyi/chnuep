from contextlib import asynccontextmanager
from fastapi import FastAPI
import uvicorn

from fastapi.middleware.cors import CORSMiddleware
from api import main_router
from database.engine import engine
from database.models import Base, User, Course, Enrollment, Assignment, \
    Submission

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Executes this code on startup
    async with engine.begin() as conn:
        # await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)
        print("--- DB Tables Created ---")

    yield  # Allowing server to proceed next actions from client

    # Executes this code on shutdown
    await engine.dispose()
    print("--- DB Connection Closed ---")

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(main_router)

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)