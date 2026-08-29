import jwt
import time
from typing import Optional, List
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, Header, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlmodel import Session, select, func
from app.database.connection import get_session
from app.core.security import get_current_user, supabase_client
from app.core.config import settings
from app.models.models import User, FeedPost, PostReaction
from app.schemas.schemas import FeedPostCreate, VoteRequest, FeedPostResponse, VoteResponse

router = APIRouter(prefix="/feed", tags=["Community Feed"])
optional_bearer = HTTPBearer(auto_error=False)


def get_optional_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Security(optional_bearer),
    session: Session = Depends(get_session)
) -> Optional[User]:
    """
    Optional authentication dependency.
    Returns the User object if a valid token is provided, or None if unauthenticated.
    """
    if not credentials or not credentials.credentials:
        return None
    try:
        token = credentials.credentials
        user_uuid = None

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

        exp = payload.get("exp")
        if exp and exp < time.time():
            return None

        user_id_str = payload.get("sub")
        if user_id_str:
            user_uuid = UUID(user_id_str)
        
        if not user_uuid:
            res = supabase_client.auth.get_user(token)
            if res and res.user:
                user_uuid = UUID(res.user.id)

        if user_uuid:
            return session.get(User, user_uuid)
    except Exception:
        pass
    return None


def is_admin_user(user: User) -> bool:
    if not user or not user.email:
        return False
    admin_emails = [e.strip().lower() for e in settings.ADMIN_EMAILS.split(",") if e.strip()]
    return user.email.lower() in admin_emails


def get_author_info(user: Optional[User]) -> tuple[str, str]:
    if not user or not user.name or not user.name.strip():
        name = "Candidate"
        initials = "CD"
    else:
        name = user.name.strip()
        parts = name.split()
        if len(parts) >= 2:
            initials = (parts[0][0] + parts[1][0]).upper()
        else:
            initials = name[:2].upper()
    return name, initials


@router.get("", response_model=List[FeedPostResponse])
def get_feed_posts(
    category: Optional[str] = None,
    limit: int = 30,
    offset: int = 0,
    current_user: Optional[User] = Depends(get_optional_user),
    session: Session = Depends(get_session)
):
    """
    Get all public, non-hidden feed posts.
    Accessible without login. Returns upvote/downvote scores and user's vote state if logged in.
    """
    statement = select(FeedPost).where(FeedPost.is_hidden == False)
    if category and category.lower() != "all":
        statement = statement.where(FeedPost.category == category)
    
    statement = statement.order_by(FeedPost.created_at.desc()).offset(offset).limit(limit)
    posts = session.exec(statement).all()

    response = []
    current_user_id = current_user.id if current_user else None

    for post in posts:
        # Fetch author details
        author = session.get(User, post.user_id)
        author_name, author_initials = get_author_info(author)

        # Count reactions
        reactions = session.exec(
            select(PostReaction).where(PostReaction.post_id == post.id)
        ).all()

        upvotes = sum(1 for r in reactions if r.vote_type == 1)
        downvotes = sum(1 for r in reactions if r.vote_type == -1)
        score = upvotes - downvotes

        user_vote = 0
        if current_user_id:
            for r in reactions:
                if r.user_id == current_user_id:
                    user_vote = r.vote_type
                    break

        response.append(
            FeedPostResponse(
                id=post.id,
                user_id=post.user_id,
                author_name=author_name,
                author_initials=author_initials,
                title=post.title,
                content=post.content,
                category=post.category,
                upvotes=upvotes,
                downvotes=downvotes,
                score=score,
                user_vote=user_vote,
                created_at=post.created_at,
            )
        )

    return response


@router.post("", response_model=FeedPostResponse)
def create_feed_post(
    post_data: FeedPostCreate,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    Create a new community story/post (Auth required).
    """
    title = post_data.title.strip()
    content = post_data.content.strip()
    category = post_data.category.strip() if post_data.category else "Personal Experience"

    if not title:
        raise HTTPException(status_code=400, detail="Post heading/title is required.")
    if len(title) > 150:
        raise HTTPException(status_code=400, detail="Title must be 150 characters or less.")
    if not content:
        raise HTTPException(status_code=400, detail="Post content story cannot be empty.")

    post = FeedPost(
        user_id=current_user.id,
        title=title,
        content=content,
        category=category,
        is_hidden=False
    )
    session.add(post)
    session.commit()
    session.refresh(post)

    author_name, author_initials = get_author_info(current_user)

    return FeedPostResponse(
        id=post.id,
        user_id=post.user_id,
        author_name=author_name,
        author_initials=author_initials,
        title=post.title,
        content=post.content,
        category=post.category,
        upvotes=0,
        downvotes=0,
        score=0,
        user_vote=0,
        created_at=post.created_at,
    )


@router.delete("/{post_id}")
def delete_feed_post(
    post_id: UUID,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    Delete a post from the community feed.
    Only the post author OR an admin user can delete a post.
    """
    post = session.get(FeedPost, post_id)
    if not post or post.is_hidden:
        raise HTTPException(status_code=404, detail="Post not found.")

    if post.user_id != current_user.id and not is_admin_user(current_user):
        raise HTTPException(status_code=403, detail="You do not have permission to delete this post.")

    post.is_hidden = True
    session.add(post)
    session.commit()
    return {"message": "Post successfully deleted."}


@router.post("/{post_id}/vote", response_model=VoteResponse)
def vote_feed_post(
    post_id: UUID,
    request: VoteRequest,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    Cast an upvote (+1) or downvote (-1) on a post.
    Toggling the same vote type removes the vote (resets to 0).
    """
    if request.vote_type not in (1, -1):
        raise HTTPException(status_code=400, detail="Invalid vote type. Must be 1 (upvote) or -1 (downvote).")

    post = session.get(FeedPost, post_id)
    if not post or post.is_hidden:
        raise HTTPException(status_code=404, detail="Post not found.")

    statement = select(PostReaction).where(
        PostReaction.post_id == post_id,
        PostReaction.user_id == current_user.id
    )
    reaction = session.exec(statement).first()

    user_vote = 0
    if reaction:
        if reaction.vote_type == request.vote_type:
            # Toggle off
            session.delete(reaction)
            user_vote = 0
        else:
            # Switch vote type
            reaction.vote_type = request.vote_type
            session.add(reaction)
            user_vote = request.vote_type
    else:
        # New vote
        reaction = PostReaction(
            post_id=post_id,
            user_id=current_user.id,
            vote_type=request.vote_type
        )
        session.add(reaction)
        user_vote = request.vote_type

    session.commit()

    # Recalculate scores
    reactions = session.exec(
        select(PostReaction).where(PostReaction.post_id == post_id)
    ).all()

    upvotes = sum(1 for r in reactions if r.vote_type == 1)
    downvotes = sum(1 for r in reactions if r.vote_type == -1)
    score = upvotes - downvotes

    return VoteResponse(
        post_id=post_id,
        upvotes=upvotes,
        downvotes=downvotes,
        score=score,
        user_vote=user_vote
    )
