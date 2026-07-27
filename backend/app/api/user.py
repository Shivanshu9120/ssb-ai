from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from datetime import datetime
from app.database.connection import get_session
from app.core.security import get_current_user
from app.models.models import User, PIQProfile
from app.schemas.schemas import PIQProfileCreate, PIQProfileResponse, UserResponse

router = APIRouter(prefix="/user", tags=["User"])


@router.get("/profile", response_model=UserResponse)
def get_profile(
    current_user: User = Depends(get_current_user)
):
    """
    Retrieve the current logged-in user along with their PIQ profile metadata.
    """
    return current_user


@router.get("/piq", response_model=PIQProfileResponse)
def get_piq_profile(
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    Retrieve the current user's full PIQ (Personal Information Questionnaire) profile.
    Returns 404 if no PIQ profile has been started yet.
    """
    statement = select(PIQProfile).where(PIQProfile.user_id == current_user.id)
    piq = session.exec(statement).first()
    if not piq:
        raise HTTPException(status_code=404, detail="PIQ profile not found")
    return piq


@router.put("/piq", response_model=PIQProfileResponse)
def upsert_piq_profile(
    piq_data: PIQProfileCreate,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    Create or update the user's PIQ profile (upsert).
    Called automatically on every tab navigation (auto-save) and on final submit.
    Only fields present in the request body are applied; omitted optional fields are left unchanged.
    """
    statement = select(PIQProfile).where(PIQProfile.user_id == current_user.id)
    piq = session.exec(statement).first()

    if not piq:
        # First time — create a new record
        piq = PIQProfile(user_id=current_user.id)
        session.add(piq)

    # Apply all provided fields
    update_data = piq_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(piq, field, value)

    piq.updated_at = datetime.utcnow()
    session.commit()
    session.refresh(piq)
    return piq
