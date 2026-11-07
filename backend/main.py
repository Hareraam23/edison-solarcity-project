import os
from datetime import datetime

from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, ConfigDict
from sqlalchemy import Column, DateTime, Integer, String, Text, create_engine
from sqlalchemy.orm import Session, declarative_base, sessionmaker

from auth import current_user, router as auth_router  # login/signup

# SQLite by default; set DATABASE_URL to use MySQL, e.g.
# mysql+pymysql://root:YOUR_PASSWORD@localhost:3306/edison_db
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./edison.db")

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {},
)
SessionLocal = sessionmaker(bind=engine, autoflush=False)
Base = declarative_base()


class Consultation(Base):
    __tablename__ = "consultations"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(150), nullable=False)
    phone = Column(String(30))
    message = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)


Base.metadata.create_all(bind=engine)


class ConsultationIn(BaseModel):
    name: str
    email: str
    phone: str = ""
    message: str = ""


class ConsultationOut(ConsultationIn):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)  # adds /signup, /login, /me


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.post("/api/consultations")
def create_consultation(data: ConsultationIn, db: Session = Depends(get_db)):
    row = Consultation(**data.model_dump())
    db.add(row)
    db.commit()
    db.refresh(row)
    return {"ok": True, "id": row.id}


# needs a login token, so visitors can't read customer details
@app.get("/api/consultations", response_model=list[ConsultationOut])
def list_consultations(
    db: Session = Depends(get_db),
    user: dict = Depends(current_user),
):
    return db.query(Consultation).order_by(Consultation.id.desc()).all()