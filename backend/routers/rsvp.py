from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, SQLModel

from ..dependencies import get_db
from ..models import User

router = APIRouter(prefix="/rsvp", tags=["rsvp"])


class RsvpRead(SQLModel):
    user_id: int
    week_id: int
    status: bool


@router.get("/{week_id}/{user_id}", response_model=RsvpRead)
def read_rsvp(week_id: int, user_id: int, db: Session = Depends(get_db)):
    # Verify user
    if not (user := db.get(User, user_id)):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )

    return RsvpRead(
        user_id=user.id,
        week_id=week_id,
        status=week_id in {week.id for week in user.appearances},
    )
