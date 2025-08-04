from sqlmodel import Field, SQLModel


class UserBase(SQLModel):
    name: str = Field(max_length=50)
    facebook: str = Field(max_length=100, nullable=True)


class User(UserBase, table=True):
    id: int = Field(default=None, primary_key=True)
