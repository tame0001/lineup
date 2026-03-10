from typing import Annotated
from pydantic import BaseModel

from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm

from .security import authenticate_user, get_current_user
from .models import User
from .routers import lineup, rsvp, user, week


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


@app.post("/token")
async def login_for_access_token(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
) -> Token:
    """
    Endpoint to handle user login and token generation.
    """
    user, token = authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return Token(access_token=token, token_type="bearer")


@app.get("/me")
async def read_current_user(current_user: Annotated[User, Depends(get_current_user)]):
    """
    Retrieve the currently authenticated user.
    """
    return current_user
