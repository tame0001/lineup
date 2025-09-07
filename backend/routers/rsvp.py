from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, SQLModel

from ..dependencies import get_db
from ..models import User, Week

router = APIRouter(prefix="/rsvp", tags=["rsvp"])


class RsvpRead(SQLModel):
    user_id: int
    week_id: int
    status: bool


class RsvpCreate(RsvpRead):
    pass


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


@router.get("/{week_id}", response_model=list[RsvpRead])
def read_rsvps(week_id: int, db: Session = Depends(get_db)):
    # Check if week exists
    if not (week := db.get(Week, week_id)):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Week not found"
        )

    players_in_week = {player.id for player in week.players}

    rsvps = []
    for user in week.players:
        rsvps.append(
            RsvpRead(
                user_id=user.id,
                week_id=week.id,
                status=user.id in players_in_week,
            )
        )
    return rsvps


@router.post("/", response_model=RsvpRead, status_code=status.HTTP_201_CREATED)
def create_rsvp(rsvp: RsvpCreate, db: Session = Depends(get_db)):
    # Verify user
    if not (user := db.get(User, rsvp.user_id)):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )

    # Check if week exists
    if not (week := db.get(Week, rsvp.week_id)):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Week not found"
        )

    if rsvp.status:
        if week in user.appearances:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User already RSVP'd for this week",
            )
        user.appearances.append(week)
    else:
        if week not in user.appearances:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User has not RSVP'd for this week",
            )
        user.appearances.remove(week)

    db.add(user)
    db.commit()
    db.refresh(user)
    return RsvpRead(
        user_id=user.id,
        week_id=week.id,
        status=week.id in {week.id for week in user.appearances},
    )
