from pydantic import BaseModel
from typing import Optional

class PredictionRequest(BaseModel):
    invoice_text: str
    metadata: Optional[dict] = None

class PredictionResponse(BaseModel):
    risk: str
    confidence: float
    recommendation: str

class UserRegister(BaseModel):
    email: str
    password: str
    role: Optional[str] = "Staff/Article"

class UserLogin(BaseModel):
    email: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

class UserResponse(BaseModel):
    id: int
    email: str
    role: str

    class Config:
        from_attributes = True
