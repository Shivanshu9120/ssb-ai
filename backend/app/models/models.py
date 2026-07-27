from datetime import datetime, date
from typing import Optional, List, Any
from uuid import UUID, uuid4
from sqlmodel import SQLModel, Field, Relationship
from sqlalchemy import Column, JSON


class User(SQLModel, table=True):
    __tablename__ = "users"
    
    id: UUID = Field(primary_key=True)
    name: Optional[str] = None
    email: str = Field(unique=True, index=True)
    plan: str = Field(default="Free")
    created_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationships
    piq_profile: Optional["PIQProfile"] = Relationship(
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


class PIQProfile(SQLModel, table=True):
    """
    Full DIPR Questionnaire No. 107-A (Revised) — SSB Personal Information Questionnaire.
    Replaces the old minimal UserProfile.
    """
    __tablename__ = "piq_profiles"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    user_id: UUID = Field(foreign_key="users.id", unique=True, nullable=False)

    # --- Completion Tracking ---
    completed_steps: int = Field(default=0)   # 0–5
    is_submitted: bool = Field(default=False)

    # --- Q1: Administrative (Selection Board info) ---
    selection_board: Optional[str] = None
    batch_no: Optional[str] = None
    chest_no: Optional[str] = None
    upsc_roll_no: Optional[str] = None

    # --- Q2 & Q3: Personal ---
    full_name: Optional[str] = None           # In CAPITALS
    father_name: Optional[str] = None

    # --- Q4: Residences (stored as JSON objects: {place, district, state, population}) ---
    max_residence: Optional[Any] = Field(
        default=None, sa_column=Column(JSON, nullable=True)
    )
    parents_residence: Optional[Any] = Field(
        default=None, sa_column=Column(JSON, nullable=True)
    )
    permanent_residence: Optional[Any] = Field(
        default=None, sa_column=Column(JSON, nullable=True)
    )

    # --- Q5: State/Demography ---
    state_district: Optional[str] = None
    religion: Optional[str] = None
    category: Optional[str] = None            # SC / ST / OBC / General
    mother_tongue: Optional[str] = None
    date_of_birth: Optional[date] = None
    marital_status: Optional[str] = None      # Married / Single / Widower

    # --- Q6: Family Details ---
    parents_alive: Optional[bool] = None
    mother_death_age: Optional[str] = None    # age at time of mother's death
    father_death_age: Optional[str] = None    # age at time of father's death
    # JSON array: [{relation, education, occupation, income}]
    family_members: Optional[Any] = Field(
        default=None, sa_column=Column(JSON, nullable=True)
    )

    # --- Q7: Academic Records ---
    # JSON array: [{qualification, institution, board_university, year, division_marks, medium, boarder_day, achievement}]
    academic_records: Optional[Any] = Field(
        default=None, sa_column=Column(JSON, nullable=True)
    )

    # --- Q8: Physical Details ---
    age_years: Optional[int] = None
    age_months: Optional[int] = None
    height: Optional[str] = None              # In metres
    weight: Optional[str] = None              # In kilograms

    # --- Q9: Occupation ---
    present_occupation: Optional[str] = None
    monthly_income: Optional[str] = None

    # --- Q10: NCC Training ---
    ncc_training: Optional[bool] = None
    # JSON array: [{total_training, wing, sub_unit, certificate}]
    ncc_details: Optional[Any] = Field(
        default=None, sa_column=Column(JSON, nullable=True)
    )

    # --- Q11: Sports, Hobbies & Extra-Curricular ---
    # JSON array: [{game, date_from, date_to, duration, represented, achievement}]
    sports: Optional[Any] = Field(
        default=None, sa_column=Column(JSON, nullable=True)
    )
    hobbies: Optional[str] = None
    # JSON array: [{activity_group, duration, achievement}]
    extracurricular: Optional[Any] = Field(
        default=None, sa_column=Column(JSON, nullable=True)
    )
    responsibility_positions: Optional[str] = None

    # --- Q12–Q14: Service Details ---
    nature_of_commission: Optional[str] = None
    choice_of_service: Optional[str] = None
    commission_attempts: Optional[int] = None
    # JSON array: [{sl_no, type_of_entry, ssb_place, date, chest_batch_no}]
    previous_interviews: Optional[Any] = Field(
        default=None, sa_column=Column(JSON, nullable=True)
    )

    # --- SSB Coaching Context (for AI RAG) ---
    exam: Optional[str] = None                # Army / Navy / Air Force
    level: Optional[str] = None              # Beginner / Intermediate / Advanced

    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    user: Optional[User] = Relationship(back_populates="piq_profile")


class Chat(SQLModel, table=True):
    __tablename__ = "chats"
    
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    user_id: UUID = Field(foreign_key="users.id", nullable=False)
    title: str = Field(default="New Conversation")
    include_piq: bool = Field(default=False)
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
    role: str = Field(nullable=False)  # 'user' or 'assistant'
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
