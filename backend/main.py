from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware


from .routers import user, week, lineup, rsvp

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
