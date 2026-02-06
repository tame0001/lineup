from typing import Annotated
from sqlmodel import create_engine, Session
from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer

from .models import User

# Connect to the SQLite database
SQLALCHEMY_DATABASE_URL = "sqlite:///./db.sql"  # Adjust the path as needed

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

fake_users_db = {
    "john": {
        "username": "john",
        "full_name": "John Doe",
        "email": "johndoe@example.com",
        "hashed_password": "password",
        "disabled": False,
    }
}


def get_db():
    with Session(engine) as session:
        yield session


def fake_decode_token(token):
    return User(id=1, name=token, is_paid=True)


async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)]):
    # Placeholder for actual user retrieval logic
    return fake_decode_token(token)


# async def get_current_active_user(current_user: Annotated[User, Depends(get_current_user)]):
