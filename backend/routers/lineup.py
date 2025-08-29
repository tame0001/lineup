from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select, SQLModel
from datetime import datetime

from ..dependencies import get_db
from ..models import Week, User

router = APIRouter(prefix="/lineups", tags=["lineup"])


class LineUpRead(SQLModel):
    date: datetime
    players: list[str]


class LineUpCreate(SQLModel):
    week_id: int | None = None
    date: datetime | None = None
    player_id: int | None = None
    player: str | None = None


class LineUpDelete(LineUpCreate):
    pass


@router.get("/{week_id}", response_model=LineUpRead)
def read_lineup(week_id: int, db: Session = Depends(get_db)):
    """
    Get the lineup for a specific week.
    """
    if not (match_day := db.get(Week, week_id)):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Match day not found"
        )

    return LineUpRead(
        date=match_day.date, players=[player.name for player in match_day.players]
    )


def verify_lineup_input(
    data: LineUpCreate | LineUpDelete, db: Session
) -> tuple[Week, User]:
    """
    Verify that the player and match day information is valid.
    """
    # Verify that either week_id or date is provided and valid
    if not data.week_id and not data.date:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Either week_id or date must be provided",
        )
    if data.week_id:
        match_day = db.get(Week, data.week_id)
    else:
        match_day = db.exec(select(Week).where(Week.date == data.date)).first()

    if not match_day:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Match day not found"
        )

    # Verify that either player_id or player name is provided and valid
    if not data.player_id and not data.player:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Either player_id or player name must be provided",
        )
    if data.player_id:
        player = db.get(User, data.player_id)
    else:
        player = db.exec(select(User).where(User.name == data.player)).first()

    if not player:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Player not found"
        )

    return match_day, player


@router.post("/", response_model=LineUpRead, status_code=status.HTTP_201_CREATED)
def create_lineup(rsvp: LineUpCreate, db: Session = Depends(get_db)):
    """
    Add a player into the match day lineup.
    """
    # Verify that the input data is valid
    match_day, player = verify_lineup_input(rsvp, db)

    # Check if player is already in the match day lineup
    if player in match_day.players:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Player is already in the match day lineup",
        )

    # Add player to match day line up
    match_day.players.append(player)
    db.add(match_day)
    db.commit()
    db.refresh(match_day)

    return LineUpRead(
        date=match_day.date, players=[player.name for player in match_day.players]
    )


@router.delete("/", response_model=LineUpRead)
def delete_lineup(rsvp: LineUpDelete, db: Session = Depends(get_db)):
    """
    Remove a player from the match day lineup.
    """
    # Verify that the input data is valid
    match_day, player = verify_lineup_input(rsvp, db)

    # Check if player is in the match day lineup
    if player not in match_day.players:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Player is not in the match day lineup",
        )

    # Remove player from match day line up
    match_day.players.remove(player)
    db.add(match_day)
    db.commit()
    db.refresh(match_day)

    return LineUpRead(
        date=match_day.date, players=[player.name for player in match_day.players]
    )
