import os, uuid, shutil
from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from typing import List
from api.dependencies import CourseRepoDependency, TeacherUserDependency, CurrentUserDependency, SessionDependency
from repositories.materials import MaterialRepository
from pydantic import BaseModel

router = APIRouter()
UPLOAD_DIR = "static/uploads"


class MaterialResponse(BaseModel):
    id: int
    title: str
    file_url: str

    class Config:
        from_attributes = True


@router.post("/{course_id}", response_model=MaterialResponse)
async def upload_material(
        course_id: int,
        course_repo: CourseRepoDependency,
        user: TeacherUserDependency,
        session: SessionDependency,
        title: str = Form(...),
        file: UploadFile = File(...)
):
    course = await course_repo.get_by_id(course_id)
    if not course or course.teacher_id != user.id:
        raise HTTPException(status_code=403, detail="Access denied")

    file_ext = file.filename.split(".")[-1]
    new_filename = f"mat_{uuid.uuid4()}.{file_ext}"
    file_path = os.path.join(UPLOAD_DIR, new_filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    repo = MaterialRepository(session)
    new_mat = await repo.create({
        "course_id": course_id,
        "title": title,
        "file_url": f"/static/uploads/{new_filename}"
    })
    await session.commit()
    return new_mat


@router.get("/{course_id}", response_model=List[MaterialResponse])
async def get_materials(course_id: int, session: SessionDependency, user: CurrentUserDependency):
    return await MaterialRepository(session).get_by_course(course_id)


@router.delete("/{material_id}", status_code=204)
async def delete_material(
        material_id: int,
        session: SessionDependency,
        course_repo: CourseRepoDependency,
        user: TeacherUserDependency
):
    repo = MaterialRepository(session)
    material = await repo.get_by_id(material_id)

    if not material:
        raise HTTPException(status_code=404, detail="Material not found")

    course = await course_repo.get_by_id(material.course_id)
    if not course or course.teacher_id != user.id:
        raise HTTPException(status_code=403, detail="You do not have permission to delete this material")

    file_path = material.file_url.lstrip("/")

    if os.path.exists(file_path):
        os.remove(file_path)

    await repo.delete(material_id)
    await session.commit()

    return None