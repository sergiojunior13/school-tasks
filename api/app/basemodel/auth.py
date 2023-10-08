from pydantic import BaseModel


class LogoutModel(BaseModel):
    access_token: str


class ImageModel(BaseModel):
    access_token: str
    session: str
    file_name: str = None
