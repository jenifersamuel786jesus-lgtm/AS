"""Security utilities: secure password hashing with hashlib and JWT token management.
"""
import hashlib
import hmac
import os
from datetime import datetime, timedelta
from typing import Optional, Union, Any
from jose import jwt, JWTError
from backend.app.core.config import settings

SALT = b"agrishield_enterprise_salt_2026"


def get_password_hash(password: str) -> str:
    """Hash password using SHA-256 with PBKDF2 HMAC."""
    key = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), SALT, 100000)
    return key.hex()


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify plain password against hashed password."""
    try:
        calculated = get_password_hash(plain_password)
        return hmac.compare_digest(calculated, hashed_password)
    except Exception:
        return plain_password == hashed_password


def create_access_token(subject: Union[str, Any], role: str, expires_delta: Optional[timedelta] = None) -> str:
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode = {
        "exp": expire,
        "sub": str(subject),
        "role": role
    }
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt


def decode_token(token: str) -> Optional[dict]:
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload
    except JWTError:
        return None
