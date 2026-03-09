import jwt
from typing import Annotated
from pydantic import BaseModel
from sqlmodel import create_engine, Session
from jwt.exceptions import InvalidTokenError

from fastapi import Depends, HTTPException, status
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
        "hashed_password": "$argon2id$v=19$m=65536,t=3,p=4$8l7bueNC+51iR5070Ps8rw$7PtkfI9BjZ9WBfMDuyGQgmr1//13j90yn47tUZK5kac",
        "disabled": False,
    }
}

SECRET_KEY = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30


class TokenData(BaseModel):
    username: str | None = None


def get_db():
    with Session(engine) as session:
        yield session


def fake_decode_token(token):
    return User(id=1, name=token, is_paid=True)


async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)]):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except InvalidTokenError:
        raise credentials_exception
    user = fake_users_db.get(token_data.username)
    if user is None:
        raise credentials_exception
    return user
