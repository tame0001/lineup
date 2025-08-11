from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select

from ..dependencies import get_db
from ..models import Week, WeekBase


class WeekRead(WeekBase):
    """
    WeekRead model for reading week data.
    """

    pass


class WeekCreate(WeekBase):
    """
    WeekCreate model for creating week data.
    """

    pass


class WeekUpdate(WeekBase):
    """
    WeekUpdate model for updating week data.
    """

    pass


router = APIRouter(prefix="/weeks", tags=["week"])
