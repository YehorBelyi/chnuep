from fastapi import APIRouter
from pydantic import BaseModel

from api.dependencies import UserRepoDependency, CurrentUserDependency
from schemas.auth import UserResponseSchema

router = APIRouter()


class UserUpdateSchema(BaseModel):
    full_name: str


@router.put("/me", response_model=UserResponseSchema)
async def update_me(
        data: UserUpdateSchema,
        user_repo: UserRepoDependency,
        user: CurrentUserDependency
):
    updated_user = await user_repo.update(user.id, data.model_dump())
    await user_repo.session.commit()
    return updated_user


@router.get("/{user_id}", response_model=UserResponseSchema)
async def get_user_profile(user_id: int, user_repo: UserRepoDependency):
    return await user_repo.get_by_id(user_id)