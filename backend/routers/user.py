from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select

from ..dependencies import get_db
from ..models import UserBase, User

router = APIRouter(prefix="/users", tags=["user"])


class UserRead(UserBase):
    """
    UserRead model for reading user data.
    """

    id: int


class UserCreate(UserBase):
    """
    UserCreate model for creating new users.
    """

    pass


@router.get("/", response_model=list[UserRead])
def read_users(db: Session = Depends(get_db)):
    """
    Retrieve all users from the database.
    """
    users = db.exec(select(User)).all()
    return users


@router.post("/", response_model=UserRead)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    """
    Create a new user in the database.
    """
    user = User.model_validate(user)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@router.get("/{user_id}", response_model=UserRead)
def read_user(user_id: int, db: Session = Depends(get_db)):
    """
    Retrieve a user by ID from the database.
    """
    user = db.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user
