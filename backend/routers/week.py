from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from datetime import datetime

from ..dependencies import get_db
from ..models import Week, WeekBase


class WeekRead(WeekBase):
    """
    WeekRead model for reading week data.
    """

    id: int


class WeekCreate(WeekBase):
    """
    WeekCreate model for creating week data.
    """

    date: datetime


class WeekUpdate(WeekBase):
    """
    WeekUpdate model for updating week data.
    """

    date: datetime | None = None


router = APIRouter(prefix="/weeks", tags=["week"])


@router.get("/", response_model=list[WeekRead])
async def read_weeks(db: Session = Depends(get_db)):
    """
    Retrieve all weeks from the database.
    """
    weeks = db.exec(select(Week)).all()
    return weeks


@router.post("/", response_model=WeekRead, status_code=status.HTTP_201_CREATED)
async def create_week(week: WeekCreate, db: Session = Depends(get_db)):
    """
    Create a new week in the database.
    """
    week = Week.model_validate(week)
    db.add(week)
    db.commit()
    db.refresh(week)
    return week


@router.get("/{week_id}", response_model=WeekRead)
async def read_week(week_id: int, db: Session = Depends(get_db)):
    """
    Retrieve a week by ID from the database.
    """
    week = db.get(Week, week_id)
    if not week:
        raise HTTPException(status_code=404, detail="Week not found")
    return week


@router.put("/{week_id}", response_model=WeekRead)
async def update_week(
    week_id: int, week_data: WeekUpdate, db: Session = Depends(get_db)
):
    """
    Update a week by ID in the database.
    """
    week = db.get(Week, week_id)
    if not week:
        raise HTTPException(status_code=404, detail="Week not found")
    week.sqlmodel_update(Week.model_dump(week_data, exclude_unset=True))
    db.add(week)
    db.commit()
    db.refresh(week)
    return week


@router.delete("/{week_id}", response_model=WeekRead)
async def delete_week(week_id: int, db: Session = Depends(get_db)):
    """
    Delete a week by ID from the database.
    """
    week = db.get(Week, week_id)
    if not week:
        raise HTTPException(status_code=404, detail="Week not found")
    db.delete(week)
    db.commit()
    return week
