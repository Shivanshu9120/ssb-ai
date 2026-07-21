from datetime import date, datetime
from sqlmodel import Session, select
from app.models.models import Usage, User, Message, Chat
from uuid import UUID

# Hard limits for Free plan
FREE_DAILY_QUESTIONS = 20

class TokenService:
    @staticmethod
    def check_limit_exceeded(user_uuid: UUID, plan: str, session: Session) -> bool:
        """
        Checks if a user has exceeded their daily question limit (for Free tier).
        """
        if plan.lower() == "premium":
            return False

        today = date.today()
        start_of_day = datetime.combine(today, datetime.min.time())

        # Count the user's questions (messages with role 'user') today
        statement = select(Message).join(Chat).where(
            Chat.user_id == user_uuid,
            Message.role == "user",
            Message.created_at >= start_of_day
        )
        messages_today = session.exec(statement).all()
        return len(messages_today) >= FREE_DAILY_QUESTIONS

    @staticmethod
    def log_usage(
        user_uuid: UUID, 
        prompt_tokens: int, 
        completion_tokens: int, 
        session: Session
    ) -> Usage:
        """
        Accumulates token usage and estimated API cost for a user on the current day.
        """
        today = date.today()
        statement = select(Usage).where(Usage.user_id == user_uuid, Usage.day == today)
        usage = session.exec(statement).first()

        # Pricing for gemini-1.5-flash:
        # Prompt: $0.075 / 1M tokens ($0.000000075 per token)
        # Completion: $0.30 / 1M tokens ($0.00000030 per token)
        cost_est = (prompt_tokens * 0.000000075) + (completion_tokens * 0.00000030)

        if not usage:
            usage = Usage(
                user_id=user_uuid,
                day=today,
                prompt_tokens=prompt_tokens,
                completion_tokens=completion_tokens,
                total_tokens=prompt_tokens + completion_tokens,
                cost=cost_est
            )
            session.add(usage)
        else:
            usage.prompt_tokens += prompt_tokens
            usage.completion_tokens += completion_tokens
            usage.total_tokens += (prompt_tokens + completion_tokens)
            usage.cost += cost_est
            session.add(usage)

        session.commit()
        session.refresh(usage)
        return usage
