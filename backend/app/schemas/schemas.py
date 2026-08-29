from pydantic import BaseModel, field_validator
from typing import Optional, List, Any, Dict
from datetime import datetime, date
from uuid import UUID


# ---------------------------------------------------------------------------
# Nested schemas for JSON array fields
# ---------------------------------------------------------------------------

class ResidenceData(BaseModel):
    place: Optional[str] = ""
    district: Optional[str] = ""
    state: Optional[str] = ""
    population: Optional[str] = ""


class PermanentResidenceData(BaseModel):
    place: Optional[str] = ""
    district: Optional[str] = ""
    state: Optional[str] = ""
    population: Optional[str] = ""
    is_district_hq: Optional[bool] = None


class FamilyMember(BaseModel):
    relation: str  # Father / Mother / Guardian / Elder Brother/Sister / Younger Brother/Sister
    education: Optional[str] = ""
    occupation: Optional[str] = ""
    income: Optional[str] = ""


class AcademicRecord(BaseModel):
    qualification: str  # Matric / 10+2 / Graduation / Post-Graduation
    institution: Optional[str] = ""
    board_university: Optional[str] = ""
    year: Optional[str] = ""
    division_marks: Optional[str] = ""
    medium: Optional[str] = ""
    boarder_day: Optional[str] = ""
    achievement: Optional[str] = ""


class NCCDetail(BaseModel):
    total_training: Optional[str] = ""
    wing: Optional[str] = ""
    sub_unit: Optional[str] = ""
    certificate: Optional[str] = ""


class SportRecord(BaseModel):
    game: Optional[str] = ""
    date_from: Optional[str] = ""
    date_to: Optional[str] = ""
    duration: Optional[str] = ""
    represented: Optional[str] = ""
    achievement: Optional[str] = ""


class ExtracurricularRecord(BaseModel):
    activity_group: Optional[str] = ""
    duration: Optional[str] = ""
    achievement: Optional[str] = ""


class InterviewRecord(BaseModel):
    sl_no: Optional[int] = None
    type_of_entry: Optional[str] = ""
    ssb_place: Optional[str] = ""
    date: Optional[str] = ""
    chest_batch_no: Optional[str] = ""

    @field_validator('sl_no', mode='before')
    @classmethod
    def parse_optional_int(cls, v):
        if v == "" or v is None or (isinstance(v, str) and not v.strip()):
            return None
        if isinstance(v, str):
            try:
                return int(v)
            except ValueError:
                return None
        return v


# ---------------------------------------------------------------------------
# PIQ Profile Create / Update
# ---------------------------------------------------------------------------

class PIQProfileCreate(BaseModel):
    # Completion tracking
    completed_steps: Optional[int] = 0
    is_submitted: Optional[bool] = False

    # Q1
    selection_board: Optional[str] = None
    batch_no: Optional[str] = None
    chest_no: Optional[str] = None
    upsc_roll_no: Optional[str] = None

    # Q2 & Q3
    full_name: Optional[str] = None
    father_name: Optional[str] = None

    # Q4 Residences
    max_residence: Optional[Dict] = None
    parents_residence: Optional[Dict] = None
    permanent_residence: Optional[Dict] = None

    # Q5
    state_district: Optional[str] = None
    religion: Optional[str] = None
    category: Optional[str] = None
    mother_tongue: Optional[str] = None
    date_of_birth: Optional[date] = None
    marital_status: Optional[str] = None

    # Q6 Family
    parents_alive: Optional[bool] = None
    mother_death_age: Optional[str] = None
    father_death_age: Optional[str] = None
    family_members: Optional[List[Dict]] = None

    # Q7 Academic
    academic_records: Optional[List[Dict]] = None

    # Q8
    age_years: Optional[int] = None
    age_months: Optional[int] = None
    height: Optional[str] = None
    weight: Optional[str] = None

    # Q9
    present_occupation: Optional[str] = None
    monthly_income: Optional[str] = None

    # Q10 NCC
    ncc_training: Optional[bool] = None
    ncc_details: Optional[List[Dict]] = None

    # Q11
    sports: Optional[List[Dict]] = None
    hobbies: Optional[str] = None
    extracurricular: Optional[List[Dict]] = None
    responsibility_positions: Optional[str] = None

    # Q12–Q14
    nature_of_commission: Optional[str] = None
    choice_of_service: Optional[str] = None
    commission_attempts: Optional[int] = None
    previous_interviews: Optional[List[Dict]] = None

    # SSB AI context
    exam: Optional[str] = None
    level: Optional[str] = None

    @field_validator('date_of_birth', mode='before')
    @classmethod
    def parse_optional_date(cls, v):
        if v == "" or v is None or (isinstance(v, str) and not v.strip()):
            return None
        return v

    @field_validator('age_years', 'age_months', 'commission_attempts', mode='before')
    @classmethod
    def parse_optional_int(cls, v):
        if v == "" or v is None or (isinstance(v, str) and not v.strip()):
            return None
        if isinstance(v, str):
            try:
                return int(v)
            except ValueError:
                return None
        return v


# ---------------------------------------------------------------------------
# PIQ Profile Response
# ---------------------------------------------------------------------------

class PIQProfileResponse(BaseModel):
    id: UUID
    user_id: UUID
    completed_steps: int
    is_submitted: bool

    selection_board: Optional[str] = None
    batch_no: Optional[str] = None
    chest_no: Optional[str] = None
    upsc_roll_no: Optional[str] = None

    full_name: Optional[str] = None
    father_name: Optional[str] = None

    max_residence: Optional[Any] = None
    parents_residence: Optional[Any] = None
    permanent_residence: Optional[Any] = None

    state_district: Optional[str] = None
    religion: Optional[str] = None
    category: Optional[str] = None
    mother_tongue: Optional[str] = None
    date_of_birth: Optional[date] = None
    marital_status: Optional[str] = None

    parents_alive: Optional[bool] = None
    mother_death_age: Optional[str] = None
    father_death_age: Optional[str] = None
    family_members: Optional[Any] = None

    academic_records: Optional[Any] = None

    age_years: Optional[int] = None
    age_months: Optional[int] = None
    height: Optional[str] = None
    weight: Optional[str] = None

    present_occupation: Optional[str] = None
    monthly_income: Optional[str] = None

    ncc_training: Optional[bool] = None
    ncc_details: Optional[Any] = None

    sports: Optional[Any] = None
    hobbies: Optional[str] = None
    extracurricular: Optional[Any] = None
    responsibility_positions: Optional[str] = None

    nature_of_commission: Optional[str] = None
    choice_of_service: Optional[str] = None
    commission_attempts: Optional[int] = None
    previous_interviews: Optional[Any] = None

    exam: Optional[str] = None
    level: Optional[str] = None

    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# ---------------------------------------------------------------------------
# User Response
# ---------------------------------------------------------------------------

class UserResponse(BaseModel):
    id: UUID
    name: Optional[str] = None
    email: str
    plan: str
    created_at: datetime
    piq_profile: Optional[PIQProfileResponse] = None

    class Config:
        from_attributes = True


# ---------------------------------------------------------------------------
# Chat & Message schemas (unchanged)
# ---------------------------------------------------------------------------

class ChatCreate(BaseModel):
    title: Optional[str] = "New Conversation"


class ChatResponse(BaseModel):
    id: UUID
    user_id: UUID
    title: str
    include_piq: bool = False
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


# ---------------------------------------------------------------------------
# Feed & Reactions schemas
# ---------------------------------------------------------------------------

class FeedPostCreate(BaseModel):
    title: str
    content: str
    category: Optional[str] = "Personal Experience"


class VoteRequest(BaseModel):
    vote_type: int  # 1 for upvote, -1 for downvote


class FeedPostResponse(BaseModel):
    id: UUID
    user_id: UUID
    author_name: str
    author_initials: str
    title: str
    content: str
    category: str
    upvotes: int
    downvotes: int
    score: int
    user_vote: int  # 1 if current user upvoted, -1 if downvoted, 0 otherwise
    created_at: datetime

    class Config:
        from_attributes = True


class VoteResponse(BaseModel):
    post_id: UUID
    upvotes: int
    downvotes: int
    score: int
    user_vote: int

