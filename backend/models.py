import enum
from sqlmodel import Field, SQLModel, Enum, Column


class GenderEnum(str, enum.Enum):
    male = "male"
    female = "female"


class UserBase(SQLModel):
    name: str = Field(max_length=50)
    facebook: str | None = Field(max_length=100, default=None)
    # for distribute equal number of girls in each team
    gender: GenderEnum = Field(sa_column=Column(Enum(GenderEnum)))


class User(UserBase, table=True):
    id: int = Field(default=None, primary_key=True)
    password: str = Field()


class WeekBase(SQLModel):
    pass


class Week(WeekBase, table=True):
    id: int = Field(default=None, primary_key=True)
