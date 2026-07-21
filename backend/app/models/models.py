from datetime import datetime, date
from typing import Optional, List
from uuid import UUID, uuid4
from sqlmodel import SQLModel, Field, Relationship

class User(SQLModel, table=True):
    __tablename__ = "users"
    
    id: UUID = Field(primary_key=True)
    name: Optional[str] = None
    email: str = Field(unique=True, index=True)
    plan: str = Field(default="Free")
    created_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationships
    profile: Optional["UserProfile"] = Relationship(
        back_populates="user", 
        sa_relationship_kwargs={"uselist": False, "cascade": "all, delete-orphan"}
    )
    chats: List["Chat"] = Relationship(
        back_populates="user", 
        sa_relationship_kwargs={"cascade": "all, delete-orphan"}
    )
    usages: List["Usage"] = Relationship(
        back_populates="user", 
        sa_relationship_kwargs={"cascade": "all, delete-orphan"}
    )

class UserProfile(SQLModel, table=True):
    __tablename__ = "user_profiles"
    
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    user_id: UUID = Field(foreign_key="users.id", unique=True, nullable=False)
    exam: str
    branch: Optional[str] = None
    attempt: int = Field(default=1)
    level: str
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    user: Optional[User] = Relationship(back_populates="profile")

class Chat(SQLModel, table=True):
    __tablename__ = "chats"
    
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    user_id: UUID = Field(foreign_key="users.id", nullable=False)
    title: str = Field(default="New Conversation")
    created_at: datetime = Field(default_factory=datetime.utcnow)

    user: Optional[User] = Relationship(back_populates="chats")
    messages: List["Message"] = Relationship(
        back_populates="chat", 
        sa_relationship_kwargs={"cascade": "all, delete-orphan", "order_by": "Message.created_at"}
    )

class Message(SQLModel, table=True):
    __tablename__ = "messages"
    
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    chat_id: UUID = Field(foreign_key="chats.id", nullable=False)
    role: str = Field(nullable=False) # 'user' or 'assistant'
    message: str = Field(nullable=False)
    prompt_tokens: int = Field(default=0)
    completion_tokens: int = Field(default=0)
    model: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

    chat: Optional[Chat] = Relationship(back_populates="messages")

class Usage(SQLModel, table=True):
    __tablename__ = "usage"
    
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    user_id: UUID = Field(foreign_key="users.id", nullable=False)
    day: date = Field(default_factory=date.today)
    prompt_tokens: int = Field(default=0)
    completion_tokens: int = Field(default=0)
    total_tokens: int = Field(default=0)
    cost: float = Field(default=0.0)

    user: Optional[User] = Relationship(back_populates="usages")
