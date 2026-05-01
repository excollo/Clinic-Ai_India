"""Authentication routes backed by MongoDB users collection."""
from __future__ import annotations

from datetime import datetime, timezone
import random
from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer

from src.adapters.db.mongo.client import get_database
from src.api.schemas.auth import (
    AuthResponse,
    ForgotPasswordLegacyRequest,
    ForgotPasswordOtpGenerateResponse,
    ForgotPasswordOtpVerifyRequest,
    ForgotPasswordOtpVerifyResponse,
    ForgotPasswordRequest,
    MessageResponse,
    ResetPasswordRequest,
    UserLoginRequest,
    UserRegisterRequest,
    UserResponse,
    UserRoleUpdateRequest,
)
from src.core.auth import create_access_token, create_refresh_token, hash_password, verify_token, verify_password
from src.core.config import get_settings

router = APIRouter(prefix="/api/auth", tags=["Authentication"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")


def _find_user_by_identifier(db, identifier: str) -> dict | None:
    ident = identifier.strip()
    return (
        db.users.find_one({"email": ident})
        or db.users.find_one({"phone": ident})
        or db.users.find_one({"username": ident})
    )


def _as_user_response(user_doc: dict) -> UserResponse:
    return UserResponse(
        id=str(user_doc["id"]),
        email=str(user_doc["email"]),
        username=str(user_doc["username"]),
        full_name=str(user_doc.get("full_name") or ""),
        phone=user_doc.get("phone"),
        role=str(user_doc.get("role") or "doctor"),
        is_active=bool(user_doc.get("is_active", True)),
        is_verified=bool(user_doc.get("is_verified", True)),
        tenant_id=user_doc.get("tenant_id"),
    )


def _build_auth_response(user_doc: dict) -> AuthResponse:
    settings = get_settings()
    token_data = {
        "sub": str(user_doc["id"]),
        "email": str(user_doc["email"]),
        "role": str(user_doc.get("role") or "doctor"),
    }
    access_token = create_access_token(token_data)
    refresh_token = create_refresh_token({"sub": str(user_doc["id"])})
    return AuthResponse(
        user=_as_user_response(user_doc),
        access_token=access_token,
        refresh_token=refresh_token,
        token_type="bearer",
        expires_in=settings.access_token_expire_minutes * 60,
    )


def _get_current_user(token: str = Depends(oauth2_scheme)) -> dict:
    payload = verify_token(token)
    if payload.get("type") != "access":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token type")
    user_id = str(payload.get("sub") or "").strip()
    if not user_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token payload")
    db = get_database()
    user_doc = db.users.find_one({"id": user_id})
    if not user_doc or not bool(user_doc.get("is_active", True)):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found or inactive")
    return user_doc


@router.post("/register", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
def register(payload: UserRegisterRequest) -> AuthResponse:
    db = get_database()
    if db.users.find_one({"username": payload.username}):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Username already registered")
    if db.users.find_one({"email": payload.email}):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")

    now = datetime.now(timezone.utc)
    user_doc = {
        "id": str(uuid4()),
        "email": payload.email,
        "username": payload.username,
        "hashed_password": hash_password(payload.password),
        "full_name": payload.full_name,
        "phone": payload.phone,
        "role": payload.role,
        "is_active": True,
        "is_verified": True,
        "tenant_id": None,
        "created_at": now,
        "updated_at": now,
    }
    db.users.insert_one(user_doc)
    return _build_auth_response(user_doc)


@router.post("/login", response_model=AuthResponse)
def login(payload: UserLoginRequest) -> AuthResponse:
    db = get_database()
    ident = payload.username.strip()
    user_doc = db.users.find_one({"username": ident}) or db.users.find_one({"email": ident})
    if not user_doc or not verify_password(payload.password, str(user_doc.get("hashed_password") or "")):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if not bool(user_doc.get("is_active", True)):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="User account is inactive")
    return _build_auth_response(user_doc)


@router.post("/forgot-password/request-otp", response_model=ForgotPasswordOtpGenerateResponse)
def request_forgot_password_otp(payload: ForgotPasswordRequest) -> ForgotPasswordOtpGenerateResponse:
    db = get_database()
    user_doc = _find_user_by_identifier(db, payload.identifier)

    # Return generic message to avoid user-enumeration leaks.
    if not user_doc:
        return ForgotPasswordOtpGenerateResponse(
            message="If this account exists, an OTP has been sent to the registered contact."
        )

    now = datetime.now(timezone.utc)
    otp = f"{random.randint(0, 999999):06d}"
    db.users.update_one(
        {"id": user_doc["id"]},
        {
            "$set": {
                "password_reset_otp": otp,
                "password_reset_otp_expires_at": now.timestamp() + 600,
                "updated_at": now,
            }
        },
    )
    return ForgotPasswordOtpGenerateResponse(
        message=f"OTP generated successfully. Use {otp} for local testing."
    )


@router.post("/forgot-password")
def forgot_password_legacy(payload: ForgotPasswordLegacyRequest) -> dict:
    db = get_database()
    user_doc = db.users.find_one({"email": payload.email.strip()})
    if not user_doc:
        return {"message": "If this account exists, reset details were generated.", "reset_token": ""}

    now = datetime.now(timezone.utc)
    reset_token = str(uuid4())
    db.users.update_one(
        {"id": user_doc["id"]},
        {
            "$set": {
                "password_reset_token": reset_token,
                "password_reset_token_expires_at": now.timestamp() + 1800,
                "updated_at": now,
            }
        },
    )
    return {"message": "Password reset token generated", "reset_token": reset_token}


@router.post("/forgot-password/verify-otp", response_model=ForgotPasswordOtpVerifyResponse)
def verify_forgot_password_otp(payload: ForgotPasswordOtpVerifyRequest) -> ForgotPasswordOtpVerifyResponse:
    db = get_database()
    user_doc = _find_user_by_identifier(db, payload.identifier)
    if not user_doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Account not found")

    expected_otp = str(user_doc.get("password_reset_otp") or "")
    expires_at_ts = float(user_doc.get("password_reset_otp_expires_at") or 0)
    now_ts = datetime.now(timezone.utc).timestamp()
    if not expected_otp or payload.otp.strip() != expected_otp:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid OTP")
    if now_ts > expires_at_ts:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="OTP has expired")

    reset_token = str(uuid4())
    db.users.update_one(
        {"id": user_doc["id"]},
        {
            "$set": {
                "password_reset_token": reset_token,
                "password_reset_token_expires_at": now_ts + 1800,
                "password_reset_otp": None,
                "password_reset_otp_expires_at": None,
                "updated_at": datetime.now(timezone.utc),
            }
        },
    )
    return ForgotPasswordOtpVerifyResponse(
        message="OTP verified successfully",
        reset_token=reset_token,
    )


@router.post("/reset-password", response_model=MessageResponse)
def reset_password(payload: ResetPasswordRequest) -> MessageResponse:
    db = get_database()
    user_doc = db.users.find_one({"password_reset_token": payload.token.strip()})
    if not user_doc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid reset token")

    expires_at_ts = float(user_doc.get("password_reset_token_expires_at") or 0)
    if datetime.now(timezone.utc).timestamp() > expires_at_ts:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Reset token has expired")

    db.users.update_one(
        {"id": user_doc["id"]},
        {
            "$set": {
                "hashed_password": hash_password(payload.password),
                "password_reset_token": None,
                "password_reset_token_expires_at": None,
                "updated_at": datetime.now(timezone.utc),
            }
        },
    )
    return MessageResponse(message="Password reset successful")


@router.get("/me", response_model=UserResponse)
def me(current_user: dict = Depends(_get_current_user)) -> UserResponse:
    return _as_user_response(current_user)


@router.post("/logout")
def logout(_: dict = Depends(_get_current_user)) -> dict:
    return {"message": "Successfully logged out"}


@router.get("/users", response_model=list[UserResponse])
def list_users(_: dict = Depends(_get_current_user)) -> list[UserResponse]:
    db = get_database()
    users = list(db.users.find({}, {"_id": 0}))
    return [_as_user_response(u) for u in users]


@router.put("/users/{user_id}/role", response_model=UserResponse)
def update_user_role(user_id: str, payload: UserRoleUpdateRequest, _: dict = Depends(_get_current_user)) -> UserResponse:
    db = get_database()
    existing = db.users.find_one({"id": user_id})
    if not existing:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    db.users.update_one(
        {"id": user_id},
        {
            "$set": {
                "role": payload.role,
                "updated_at": datetime.now(timezone.utc),
            }
        },
    )
    updated = db.users.find_one({"id": user_id})
    if not updated:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return _as_user_response(updated)

