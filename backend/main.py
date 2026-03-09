import jwt
from typing import Annotated
from datetime import datetime, timedelta, timezone
from pwdlib import PasswordHash
from pydantic import BaseModel

from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm

from .dependencies import get_current_user
from .models import User
from .routers import lineup, rsvp, user, week

SECRET_KEY = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

fake_users_db = {
    "john": {
        "username": "john",
        "full_name": "John Doe",
        "email": "johndoe@example.com",
        "hashed_password": "$argon2id$v=19$m=65536,t=3,p=4$8l7bueNC+51iR5070Ps8rw$7PtkfI9BjZ9WBfMDuyGQgmr1//13j90yn47tUZK5kac",
        "disabled": False,
    }
}


class Token(BaseModel):
    access_token: str
    token_type: str


app = FastAPI()
app.include_router(user.router)
app.include_router(week.router)
app.include_router(lineup.router)
app.include_router(rsvp.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


password_hash = PasswordHash.recommended()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


def verify_password(plain_password, hashed_password):
    return password_hash.verify(plain_password, hashed_password)


def get_password_hash(password):
    return password_hash.hash(password)


def authenticate_user(username: str, password: str):
    user = fake_users_db.get(username)
    print(get_password_hash(password))
    if not user:
        verify_password(
            password, password_hash.hash("dummy")
        )  # To prevent timing attacks
        return False
    if not verify_password(password, user["hashed_password"]):
        return False
    return user


def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


@app.post("/token")
async def login_for_access_token(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
) -> Token:
    """
    Endpoint to handle user login and token generation.
    """
    user = authenticate_user(form_data.username, form_data.password)
    print(user)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(
        data={"sub": user["username"]},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES),
    )

    return Token(access_token=access_token, token_type="bearer")


@app.get("/me")
async def read_current_user(current_user: Annotated[User, Depends(get_current_user)]):
    """
    Retrieve the currently authenticated user.
    """
    return current_user
