from fastapi import APIRouter, Depends, WebSocket, WebSocketDisconnect, HTTPException
from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel
from datetime import datetime

from api.dependencies import get_session, CurrentUserDependency, security
from repositories.notifications import NotificationRepository
from repositories.users import UserRepository
from utils.websocket_manager import manager

router = APIRouter()

class NotificationSchema(BaseModel):
    id: int
    message: str
    is_read: bool
    created_at: datetime
    class Config:
        from_attributes = True

@router.websocket("/ws")
async def websocket_notifications(websocket: WebSocket, session: AsyncSession = Depends(get_session)):
    token = websocket.cookies.get(security.config.JWT_ACCESS_COOKIE_NAME)
    user = None
    if token:
        try:
            payload = security.verify_token(token)
            user_id = int(payload.sub)
            user = await UserRepository(session).get_by_id(user_id)
        except Exception:
            pass

    if not user:
        await websocket.close(code=1008)
        return
    await manager.connect(websocket, user.id)

    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket, user.id)

@router.get("/", response_model=List[NotificationSchema])
async def get_notifications(
    user: CurrentUserDependency,
    session: AsyncSession = Depends(get_session)
):
    repo = NotificationRepository(session)
    return await repo.get_user_notifications(user.id)

@router.patch("/{id}/read")
async def mark_read(
    id: int,
    user: CurrentUserDependency,
    session: AsyncSession = Depends(get_session)
):
    repo = NotificationRepository(session)
    await repo.mark_as_read(id)
    await session.commit()
    return {"ok": True}