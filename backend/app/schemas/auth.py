from pydantic import BaseModel
from pydantic import Field
from pydantic import model_validator


class UserLogin(BaseModel):
    email: str
    password: str


class UserRegister(BaseModel):
    email: str
    password1: str = Field(..., min_length=10)
    password2: str

    @model_validator(mode="after")
    def validate_passwords(self):
        if self.password1 != self.password2:
            message = "Passwords do not match"
            raise ValueError(message)
        return self
