import os
import re
import sqlite3
from datetime import datetime, timedelta, timezone

import bcrypt
import jwt
from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from pydantic import BaseModel

# IMPORTANT: set a real secret before going live
SECRET_KEY = os.getenv("SECRET_KEY", "dev-only-change-me")
ALGORITHM = "HS256"
TOKEN_HOURS = 24
DB_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "users.db")

router = APIRouter(tags=["auth"])
bearer = HTTPBearer()


def get_db():
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    with get_db() as conn:
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT NOT NULL UNIQUE,
                password_hash TEXT NOT NULL,
                created_at TEXT NOT NULL
            )
            """
        )


init_db()


class SignupRequest(BaseModel):
    name: str
    email: str
    password: str


class LoginRequest(BaseModel):
    email: str
    password: str


def make_token(user_id: int) -> str:
    payload = {
        "sub": str(user_id),
        "exp": datetime.now(timezone.utc) + timedelta(hours=TOKEN_HOURS),
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def valid_email(email: str) -> bool:
    return re.fullmatch(r"\S+@\S+\.\S+", email) is not None


def current_user(creds: HTTPAuthorizationCredentials = Depends(bearer)):
    try:
        data = jwt.decode(creds.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = int(data["sub"])
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired token.")
    with get_db() as conn:
        user = conn.execute(
            "SELECT id, name, email FROM users WHERE id = ?", (user_id,)
        ).fetchone()
    if user is None:
        raise HTTPException(status_code=401, detail="User not found.")
    return dict(user)


@router.post("/signup", status_code=201)
def signup(body: SignupRequest):
    name = body.name.strip()
    email = body.email.strip().lower()

    if not name:
        raise HTTPException(status_code=400, detail="Name is required.")
    if not valid_email(email):
        raise HTTPException(status_code=400, detail="Enter a valid email address.")
    if len(body.password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters.")
    if len(body.password.encode()) > 72:
        raise HTTPException(status_code=400, detail="Password is too long (max 72 characters).")

    hashed = bcrypt.hashpw(body.password.encode(), bcrypt.gensalt()).decode()
    try:
        with get_db() as conn:
            cur = conn.execute(
                "INSERT INTO users (name, email, password_hash, created_at) VALUES (?, ?, ?, ?)",
                (name, email, hashed, datetime.now(timezone.utc).isoformat()),
            )
            user_id = cur.lastrowid
    except sqlite3.IntegrityError:
        raise HTTPException(status_code=400, detail="An account with this email already exists.")

    return {"access_token": make_token(user_id), "token_type": "bearer", "name": name}


@router.post("/login")
def login(body: LoginRequest):
    email = body.email.strip().lower()
    with get_db() as conn:
        user = conn.execute(
            "SELECT id, name, password_hash FROM users WHERE email = ?", (email,)
        ).fetchone()

    if user is None or len(body.password.encode()) > 72 or not bcrypt.checkpw(
        body.password.encode(), user["password_hash"].encode()
    ):
        raise HTTPException(status_code=401, detail="Incorrect email or password.")

    return {"access_token": make_token(user["id"]), "token_type": "bearer", "name": user["name"]}


@router.get("/me")
def me(user: dict = Depends(current_user)):
    return user