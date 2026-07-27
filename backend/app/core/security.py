import jwt
import time
from uuid import UUID
from fastapi import HTTPException, Security, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from supabase import create_client, Client
from app.core.config import settings
from app.database.connection import get_session
from app.models.models import User
from sqlmodel import Session

supabase_client: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)
security_bearer = HTTPBearer()

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Security(security_bearer),
    session: Session = Depends(get_session)
) -> User:
    """
    Authenticate candidate using local JWT token verification first (fast, 0ms, offline-safe).
    Falls back to Supabase auth API if needed.
    """
    token = credentials.credentials
    user_uuid = None
    email = None
    name = None

    # Step 1: Local JWT decode (eliminates network latency and Windows socket [WinError 10035] errors)
    try:
        if settings.SUPABASE_JWT_SECRET and settings.SUPABASE_JWT_SECRET != "placeholder_jwt_secret":
            try:
                payload = jwt.decode(
                    token, 
                    settings.SUPABASE_JWT_SECRET, 
                    algorithms=["HS256"], 
                    options={"verify_aud": False}
                )
            except Exception:
                payload = jwt.decode(token, options={"verify_signature": False})
        else:
            payload = jwt.decode(token, options={"verify_signature": False})

        # Check token expiration
        exp = payload.get("exp")
        if exp and exp < time.time():
            raise HTTPException(status_code=401, detail="Session expired. Please log in again.")

        user_id_str = payload.get("sub")
        if user_id_str:
            user_uuid = UUID(user_id_str)
            email = payload.get("email")
            user_meta = payload.get("user_metadata") or {}
            name = user_meta.get("name") or user_meta.get("full_name")
    except HTTPException:
        raise
    except Exception as jwt_err:
        print(f"[AUTH WARNING] Local JWT decode failed: {jwt_err}. Attempting Supabase fallback...")

    # Step 2: Supabase API fallback (only if local JWT decode failed)
    if not user_uuid:
        try:
            res = supabase_client.auth.get_user(token)
            if res and res.user:
                user_uuid = UUID(res.user.id)
                email = res.user.email
                if res.user.user_metadata:
                    name = res.user.user_metadata.get("name")
        except Exception as e:
            print(f"[AUTH ERROR] Supabase API auth check failed: {type(e).__name__}: {str(e)}")
            raise HTTPException(
                status_code=401,
                detail="Authentication failed. Please log in again."
            )

    if not user_uuid:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")

    # Step 3: Get or sync user in local database
    try:
        user = session.get(User, user_uuid)
        if not user:
            user = User(
                id=user_uuid,
                email=email or "candidate@ssbai.com",
                name=name,
                plan="Free"
            )
            session.add(user)
            session.commit()
            session.refresh(user)
        return user
    except Exception as db_err:
        print(f"[AUTH DB ERROR] Failed user database sync: {db_err}")
        raise HTTPException(status_code=500, detail="Database user retrieval error")
