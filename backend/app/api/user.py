from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from datetime import datetime
from app.database.connection import get_session
from app.core.security import get_current_user
from app.models.models import User, UserProfile
from app.schemas.schemas import UserProfileCreate, UserProfileResponse, UserResponse

router = APIRouter(prefix="/user", tags=["User"])

@router.get("/profile", response_model=UserResponse)
def get_profile(
    current_user: User = Depends(get_current_user)
):
    """
    Retrieve the current logged-in user and their profile metadata.
    """
    return current_user

@router.put("/profile", response_model=UserProfileResponse)
def update_profile(
    profile_data: UserProfileCreate,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    Create or update the user onboarding details (exam, branch, attempt, level).
    """
    statement = select(UserProfile).where(UserProfile.user_id == current_user.id)
    profile = session.exec(statement).first()

    if not profile:
        profile = UserProfile(
            user_id=current_user.id,
            exam=profile_data.exam,
            branch=profile_data.branch,
            attempt=profile_data.attempt,
            level=profile_data.level
        )
    else:
        profile.exam = profile_data.exam
        profile.branch = profile_data.branch
        profile.attempt = profile_data.attempt
        profile.level = profile_data.level
        profile.updated_at = datetime.utcnow()

    session.add(profile)
    session.commit()
    session.refresh(profile)
    return profile
