from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from database.models import Submission
from repositories.base import BaseRepository


class SubmissionRepository(BaseRepository[Submission]):
    def __init__(self, session: AsyncSession):
        super().__init__(Submission, session)

    async def get_by_assignment_and_student(self, assignment_id: int, student_id: int) -> Submission | None:
        query = select(Submission).where(
            Submission.assignment_id == assignment_id,
            Submission.student_id == student_id
        )
        result = await self.session.execute(query)
        return result.scalars().one_or_none()

    async def get_by_assignment(self, assignment_id: int) -> List[Submission]:
        query = select(Submission).where(Submission.assignment_id == assignment_id)
        result = await self.session.execute(query)
        return result.scalars().all()