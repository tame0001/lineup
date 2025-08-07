from sqlmodel import Field, SQLModel


class UserBase(SQLModel):
    name: str = Field(max_length=50)
    facebook: str | None = Field(max_length=100, default=None)


class User(UserBase, table=True):
    id: int = Field(default=None, primary_key=True)
