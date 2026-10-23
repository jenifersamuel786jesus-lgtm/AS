"""Authentication endpoints for Farmers, FPOs, and Admins.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.app.database.session import get_db
from backend.app.database.models import User
from backend.app.schemas.schemas import UserRegister, UserLogin, UserOut, Token
from backend.app.core.security import verify_password, get_password_hash, create_access_token

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=Token)
def register(user_in: UserRegister, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == user_in.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this email already exists."
        )
    user = User(
        name=user_in.name,
        email=user_in.email,
        hashed_password=get_password_hash(user_in.password),
        phone_number=user_in.phone_number,
        role=user_in.role or "farmer",
        preferred_state=user_in.preferred_state or "Tamil Nadu",
        preferred_mandi=user_in.preferred_mandi or "Oddanchatram",
        preferred_crop=user_in.preferred_crop or "Tomato",
        language=user_in.language or "en"
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token(subject=user.id, role=user.role)
    return Token(access_token=token, user=UserOut.from_orm(user))


@router.post("/login", response_model=Token)
def login(user_in: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == user_in.email).first()
    if not user or not verify_password(user_in.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password."
        )
    token = create_access_token(subject=user.id, role=user.role)
    return Token(access_token=token, user=UserOut.from_orm(user))


@router.get("/me", response_model=UserOut)
def get_current_user(user_id: int = 1, db: Session = Depends(get_db)):
    # Fallback to demo farmer user id 1
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        user = db.query(User).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return UserOut.from_orm(user)
