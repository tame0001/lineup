from typing import Annotated
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm

from .dependencies import get_current_user
from .models import User
from .routers import user, week, lineup, rsvp

fake_users_db = {
    "john": {
        "username": "john",
        "full_name": "John Doe",
        "email": "johndoe@example.com",
        "hashed_password": "password",
        "disabled": False,
    }
}

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


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


@app.post("/token")
async def login(form_data: Annotated[OAuth2PasswordRequestForm, Depends()]):
    """
    Endpoint to handle user login and token generation.
    """
    user_dict = fake_users_db.get(form_data.username)
    print(user_dict)
    if not user_dict or form_data.password != user_dict["hashed_password"]:
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    return {"access_token": user_dict["username"], "token_type": "bearer"}


@app.get("/me")
async def read_current_user(current_user: Annotated[User, Depends(get_current_user)]):
    """
    Retrieve the currently authenticated user.
    """
    return current_user
