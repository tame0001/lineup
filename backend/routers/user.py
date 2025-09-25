from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select

from ..dependencies import get_db
from ..models import UserBase, User, GenderEnum

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

    password: str | None = None


class UserUpdate(UserBase):
    """
    UserUpdate model for updating existing users.
    """

    name: str | None = None
    facebook: str | None = None
    gender: GenderEnum | None = None
    password: str | None = None
    is_paid: bool | None = None


@router.get("/", response_model=list[UserRead])
async def read_users(db: Session = Depends(get_db)):
    """
    Retrieve all users from the database.
    """
    users = db.exec(select(User)).all()
    return users


def trim_facebook_url(facebook: str | None) -> str | None:
    """
    Helper function to trim the Facebook URL.
    """
    if facebook and facebook.startswith("https://www.facebook.com/"):
        return facebook[len("https://www.facebook.com/") :]
    return facebook


@router.post("/", response_model=UserRead, status_code=status.HTTP_201_CREATED)
async def create_user(user: UserCreate, db: Session = Depends(get_db)):
    """
    Create a new user in the database.
    """
    user = User.model_validate(user)
    user.facebook = trim_facebook_url(user.facebook)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@router.get("/{user_id}", response_model=UserRead)
async def read_user(user_id: int, db: Session = Depends(get_db)):
    """
    Retrieve a user by ID from the database.
    """
    user = db.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.delete("/{user_id}", response_model=UserRead)
async def delete_user(user_id: int, db: Session = Depends(get_db)):
    """
    Delete a user by ID from the database.
    """
    user = db.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    db.delete(user)
    db.commit()
    return user


@router.patch("/{user_id}", response_model=UserRead)
async def update_user(
    user_id: int, user_data: UserUpdate, db: Session = Depends(get_db)
):
    """
    Update a user by ID in the database.
    """
    user = db.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if user_data.facebook:
        user_data.facebook = trim_facebook_url(user_data.facebook)
    user.sqlmodel_update(User.model_dump(user_data, exclude_unset=True))
    db.add(user)
    db.commit()
    db.refresh(user)
    return user
