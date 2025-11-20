from typing import List

from fastapi import APIRouter, HTTPException, Response, status, Depends
from authx import AuthX

from schemas.auth import UserLoginSchema, UserRegisterSchema, UserResponseSchema
from utils.security import verify_password, get_password_hash
from api.dependencies import (
    security,
    UserRepoDependency,
    CurrentUserDependency,
    verify_admin_role,
    AdminUserDependency
)

router = APIRouter()


@router.post("/register", response_model=UserResponseSchema, status_code=status.HTTP_201_CREATED)
async def register(
        user_data: UserRegisterSchema,
        user_repo: UserRepoDependency
):
    # Checking whether user exists by their email
    existing_user = await user_repo.get_by_email(user_data.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    # Hashing password (using Argon2 algorithm)
    hashed_pw = get_password_hash(user_data.password)

    new_user_data = {
        "email": user_data.email,
        "password_hash": hashed_pw,
        "full_name": user_data.full_name,
        "role": user_data.role,
        "avatar_url": None
    }

    # Creating user
    new_user = await user_repo.create(new_user_data)

    # Adding new user to the database
    await user_repo.session.commit()

    return new_user


@router.post("/login")
async def login(
        creds: UserLoginSchema,
        response: Response,
        user_repo: UserRepoDependency
):
    # Checking whether user exists by email
    user = await user_repo.get_by_email(creds.email)

    # User vaiidation
    if not user or not verify_password(creds.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )

    # Creating user access token
    token = security.create_access_token(
        uid=str(user.id),
        data={"role": user.role.value}
    )

    # Setting access token through cookies for this user
    response.set_cookie(
        security.config.JWT_ACCESS_COOKIE_NAME,
        token,
        httponly=True,
        samesite="lax",
        secure=False
    )

    return {
        "access_token": token,
        "user": {
            "id": user.id,
            "email": user.email,
            "full_name": user.full_name,
            "role": user.role,
            "avatar_url": user.avatar_url
        }
    }


@router.post("/logout")
def logout(response: Response):
    security.unset_access_cookies(response)
    return {"message": "Successfully logged out"}


@router.get("/me", response_model=UserResponseSchema)
async def get_me(user: CurrentUserDependency):
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    return user

@router.get("/students", response_model=List[UserResponseSchema])
async def get_all_students(
    user_repo: UserRepoDependency,
    admin: AdminUserDependency
):
    return await user_repo.get_all_students()