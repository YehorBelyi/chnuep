import os

from fastapi import APIRouter, HTTPException, Response, Depends
from authx import AuthX, AuthXConfig

from schemas.auth import UserLoginSchema
from config import settings

router = APIRouter()
config = AuthXConfig()
config.JWT_SECRET_KEY = settings.JWT_SECRET_KEY
config.JWT_ACCESS_COOKIE_NAME = "Access_Token"
config.JWT_TOKEN_LOCATION = ["cookies"]

security = AuthX(config=config)

@router.post("/login")
def login(creds: UserLoginSchema, response: Response):
    if creds.username == "test" and creds.password == "test":
        token = security.create_access_token(uid="12345")
        response.set_cookie(config.JWT_ACCESS_COOKIE_NAME, token)
        return {"access_token": token}
    raise HTTPException(status_code=401, detail="Invalid username or password")

@router.get("/protected", dependencies=[Depends(security.access_token_required)])
def protected():
    return {"data":"TOP SECRET"}