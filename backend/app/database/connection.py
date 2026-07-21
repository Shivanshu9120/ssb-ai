from sqlmodel import create_engine, Session
from sqlalchemy.engine import make_url, URL
from app.core.config import settings

raw_url = settings.DATABASE_URL
if raw_url.startswith("postgres://"):
    raw_url = raw_url.replace("postgres://", "postgresql://", 1)

# Use make_url to correctly parse percent-encoded characters (e.g. %40 in password)
_parsed = make_url(raw_url)
db_url = URL.create(
    drivername=_parsed.drivername,
    username=_parsed.username,
    password=_parsed.password,   # SQLAlchemy decodes %40 → @ here
    host=_parsed.host,
    port=_parsed.port,
    database=_parsed.database,
)

engine = create_engine(
    db_url,
    pool_pre_ping=True,
    echo=(settings.ENV == "development")
)

def get_session():
    with Session(engine) as session:
        yield session
