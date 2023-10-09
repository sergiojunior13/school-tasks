from pydantic import BaseModel


class LogoutModel(BaseModel):
    access_token: str


class ImageModel(BaseModel):
    access_token: str
    session: str
    position: int = 0


class AssetsModel(BaseModel):
    filename: str
    session: str
