import enum
from datetime import datetime
from sqlmodel import Field, Relationship, SQLModel, Enum, Column


class MatchDayLineUp(SQLModel, table=True):
    week_id: int = Field(foreign_key="week.id", primary_key=True)
    user_id: int = Field(foreign_key="user.id", primary_key=True)


class GenderEnum(str, enum.Enum):
    male = "male"
    female = "female"


class UserBase(SQLModel):
    name: str = Field(max_length=50)
    facebook: str | None = Field(max_length=100, default=None)
    last_login: datetime | None = Field(default=None)
    # for distribute equal number of girls in each team
    gender: GenderEnum = Field(sa_column=Column(Enum(GenderEnum)))
    is_paid: bool | None = Field(default=False)
    is_active: bool | None = Field(default=True)


class User(UserBase, table=True):
    id: int = Field(default=None, primary_key=True)
    password: str | None = Field(default=None, max_length=25)

    appearances: list["Week"] = Relationship(
        back_populates="players", link_model=MatchDayLineUp
    )


class WeekBase(SQLModel):
    date: datetime | None = Field(default=None)


class Week(WeekBase, table=True):
    id: int = Field(default=None, primary_key=True)

    players: list[User] = Relationship(
        back_populates="appearances", link_model=MatchDayLineUp
    )
