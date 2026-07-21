from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime, date
from uuid import UUID

class UserProfileCreate(BaseModel):
    exam: str
    branch: Optional[str] = None
    attempt: int = 1
    level: str

class UserProfileResponse(BaseModel):
    id: UUID
    user_id: UUID
    exam: str
    branch: Optional[str] = None
    attempt: int
    level: str
    updated_at: datetime

    class Config:
        from_attributes = True

class UserResponse(BaseModel):
    id: UUID
    name: Optional[str] = None
    email: str
    plan: str
    created_at: datetime
    profile: Optional[UserProfileResponse] = None

    class Config:
        from_attributes = True

class ChatCreate(BaseModel):
    title: Optional[str] = "New Conversation"

class ChatResponse(BaseModel):
    id: UUID
    user_id: UUID
    title: str
    created_at: datetime

    class Config:
        from_attributes = True

class MessageCreate(BaseModel):
    message: str

class MessageResponse(BaseModel):
    id: UUID
    chat_id: UUID
    role: str
    message: str
    prompt_tokens: int
    completion_tokens: int
    model: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class UsageResponse(BaseModel):
    id: UUID
    user_id: UUID
    day: date
    prompt_tokens: int
    completion_tokens: int
    total_tokens: int
    cost: float

    class Config:
        from_attributes = True
