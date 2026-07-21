from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from app.database.connection import get_session
from app.core.security import get_current_user
from app.models.models import User, Usage
from app.schemas.schemas import UsageResponse
from typing import List

router = APIRouter(prefix="/usage", tags=["Usage"])

@router.get("", response_model=List[UsageResponse])
def get_usage(
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    Retrieve token usage logs sorted chronologically (latest first) for the dashboard.
    """
    statement = select(Usage).where(Usage.user_id == current_user.id).order_by(Usage.day.desc())
    usages = session.exec(statement).all()
    return usages
