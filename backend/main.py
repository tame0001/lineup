from fastapi import FastAPI


from .routers import user, week, lineup

app = FastAPI()
app.include_router(user.router)
app.include_router(week.router)
app.include_router(lineup.router)
