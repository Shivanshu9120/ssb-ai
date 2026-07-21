from fastapi import HTTPException, Security, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from supabase import create_client, Client
from app.core.config import settings
from app.database.connection import get_session
from app.models.models import User
from sqlmodel import Session
from uuid import UUID

supabase_client: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)
security_bearer = HTTPBearer()

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Security(security_bearer),
    session: Session = Depends(get_session)
) -> User:
    token = credentials.credentials
    try:
        # Call Supabase to get the user details from the JWT
        res = supabase_client.auth.get_user(token)
        if not res or not res.user:
            raise HTTPException(status_code=401, detail="Invalid authentication credentials")
        
        supabase_user = res.user
        user_uuid = UUID(supabase_user.id)
        
        # Check if the user exists in our local table
        user = session.get(User, user_uuid)
        if not user:
            # Fallback sync: if trigger did not execute or was delayed
            user = User(
                id=user_uuid,
                email=supabase_user.email,
                name=supabase_user.user_metadata.get("name") if supabase_user.user_metadata else None,
                plan="Free"
            )
            session.add(user)
            session.commit()
            session.refresh(user)
            
        return user
    except Exception as e:
        raise HTTPException(
            status_code=401,
            detail=f"Invalid token or session expired: {str(e)}"
        )
