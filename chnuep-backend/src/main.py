from contextlib import asynccontextmanager
from fastapi import FastAPI
import uvicorn
import os
from fastapi.staticfiles import StaticFiles

from fastapi.middleware.cors import CORSMiddleware
from api import main_router
from database.engine import engine
from database.models import Base, User, Course, Enrollment, Assignment, \
    Submission

# Creating folder for user uploads if it does not exist
os.makedirs("static/uploads", exist_ok=True)

@asynccontextmanager
async def lifespan(app: FastAPI):
    '''THIS SECTION IS COMMENTED AS THIS PROJECT USES
    ALEMBIC MIGRATIONS AND WE DON'T NEED TO RECREATE DATABASE ANYMORE'''
    # # Executes this code on startup
    # async with engine.begin() as conn:
    #     # await conn.run_sync(Base.metadata.drop_all)
    #     await conn.run_sync(Base.metadata.create_all)
    #     print("--- DB Tables Created ---")

    yield  # Allowing server to proceed next actions from client

    # Executes this code on shutdown
    await engine.dispose()
    print("--- DB Connection Closed ---")

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mounting static uploads
# Now will be available at http://localhost:8000/static/uploads/filename
app.mount("/static", StaticFiles(directory="static"), name="static")

app.include_router(main_router)

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)