import random
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select, SQLModel
from datetime import datetime

from ..dependencies import get_db
from ..models import Week, User

router = APIRouter(prefix="/lineups", tags=["lineup"])


class LineUpRead(SQLModel):
    date: datetime
    players: list[str]
    n_players: int


class LineUpCreate(SQLModel):
    week_id: int | None = None
    date: datetime | None = None
    player_id: int | None = None
    player: str | None = None


class LineUpDelete(LineUpCreate):
    pass


class RosterRead(SQLModel):
    team: str
    players: list[str]


class TeamLineUpRead(SQLModel):
    date: datetime
    teams: list[RosterRead]


@router.get("/{week_id}", response_model=TeamLineUpRead)
def read_lineup(week_id: int, db: Session = Depends(get_db)):
    """
    Get the lineup for a specific week.
    """
    if not (match_day := db.get(Week, week_id)):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Match day not found"
        )

    # Assign team process
    team_colors = ["yellow", "blue", "orange"]
    # First check number of players
    n_players = len(match_day.players)
    # Decide number of teams
    n_teams = 2 if n_players < 15 else 3
    # Filter female players
    female_players = [
        player for player in match_day.players if player.gender == "female"
    ]
    random.shuffle(female_players)
    # Filling team with female players
    teams = [[] for _ in range(n_teams)]
    for i, player in enumerate(female_players):
        teams[i % n_teams].append(player)

    # Fill remaining spots with male players
    male_players = [player for player in match_day.players if player.gender == "male"]
    random.shuffle(male_players)
    for i, player in enumerate(male_players):
        teams[n_teams - 1 - (i % n_teams)].append(player)

    return TeamLineUpRead(
        date=match_day.date,
        teams=[
            RosterRead(
                team=team_colors[i], players=[player.name for player in teams[i]]
            )
            for i in range(n_teams)
        ],
    )


def verify_input(data: LineUpCreate | LineUpDelete, db: Session) -> tuple[Week, User]:
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
    match_day, player = verify_input(rsvp, db)

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
        date=match_day.date,
        players=[player.name for player in match_day.players],
        n_players=len(match_day.players),
    )


@router.delete("/", response_model=LineUpRead)
def delete_lineup(rsvp: LineUpDelete, db: Session = Depends(get_db)):
    """
    Remove a player from the match day lineup.
    """
    # Verify that the input data is valid
    match_day, player = verify_input(rsvp, db)

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
        date=match_day.date,
        players=[player.name for player in match_day.players],
        n_players=len(match_day.players),
    )
