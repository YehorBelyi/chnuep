from typing import Annotated
from fastapi import Depends, HTTPException, Request, status
from sqlalchemy.ext.asyncio import AsyncSession
from authx import AuthX, AuthXConfig

from config import settings
from database.engine import get_session
from database.models import User, UserRole
from repositories.assignments import AssignmentRepository
from repositories.courses import CourseRepository
from repositories.users import UserRepository
from repositories.submissions import SubmissionRepository

# Configuring AuthX
config = AuthXConfig()
config.JWT_SECRET_KEY = settings.JWT_SECRET_KEY
config.JWT_ACCESS_COOKIE_NAME = "access_token"
config.JWT_TOKEN_LOCATION = ["cookies"]
config.JWT_COOKIE_CSRF_PROTECT = False

security = AuthX(config=config)

# Session dependency for database
SessionDependency = Annotated[AsyncSession, Depends(get_session)]

''' --- REPOSITORIES --- '''
# Getting user repository
async def get_user_repo(session: SessionDependency) -> UserRepository:
    return UserRepository(session)

UserRepoDependency = Annotated[UserRepository, Depends(get_user_repo)]

# Getting course repository
async def get_course_repo(session: SessionDependency) -> CourseRepository:
    return CourseRepository(session)

CourseRepoDependency = Annotated[CourseRepository, Depends(get_course_repo)]

async def get_assignment_repo(session: SessionDependency) -> AssignmentRepository:
    return AssignmentRepository(session)

AssignmentRepoDependency = Annotated[AssignmentRepository, Depends(get_assignment_repo)]


async def get_submission_repo(session: SessionDependency) -> SubmissionRepository:
    return SubmissionRepository(session)

SubmissionRepoDependency = Annotated[SubmissionRepository, Depends(get_submission_repo)]

from repositories.enrollments import EnrollmentRepository

async def get_enrollment_repo(session: SessionDependency) -> EnrollmentRepository:
    return EnrollmentRepository(session)

EnrollmentRepoDependency = Annotated[EnrollmentRepository, Depends(get_enrollment_repo)]

# Authorization dependency

async def get_current_user_id(payload = Depends(security.access_token_required)) -> int:
    """Return User Id from JWT Token"""
    try:
        return int(payload.sub)
    except (ValueError, AttributeError):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload"
        )

async def get_current_user(
    user_id: int = Depends(get_current_user_id),
    user_repo: UserRepository = Depends(get_user_repo)
) -> User:
    """Gets user info from database"""
    user = await user_repo.get_by_id(user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )
    return user

CurrentUserDependency = Annotated[User, Depends(get_current_user)]

# Role checking dependency

async def verify_teacher_role(user: CurrentUserDependency) -> User:
    if user.role not in [UserRole.TEACHER, UserRole.ADMIN]:
         raise HTTPException(
             status_code=status.HTTP_403_FORBIDDEN,
             detail="Only teachers or admins can perform this action"
         )
    return user

async def verify_admin_role(user: CurrentUserDependency) -> User:
    if user.role != UserRole.ADMIN:
         raise HTTPException(
             status_code=status.HTTP_403_FORBIDDEN,
             detail="Only admins can perform this action"
         )
    return user

TeacherUserDependency = Annotated[User, Depends(verify_teacher_role)]

AdminUserDependency = Annotated[User, Depends(verify_admin_role)]