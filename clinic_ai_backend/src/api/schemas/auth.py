"""Authentication API schemas."""
from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, Field


class UserRegisterRequest(BaseModel):
    email: str = Field(min_length=3, max_length=254)
    username: str = Field(min_length=3, max_length=64)
    password: str = Field(min_length=8, max_length=256)
    full_name: str = Field(min_length=1, max_length=120)
    phone: str | None = Field(default=None, max_length=30)
    role: str = Field(default="doctor", min_length=1, max_length=40)


class UserLoginRequest(BaseModel):
    username: str = Field(min_length=1, max_length=120, description="Username or email")
    password: str = Field(min_length=1, max_length=256)


class ForgotPasswordRequest(BaseModel):
    identifier: str = Field(min_length=3, max_length=254, description="Registered email or phone")


class ForgotPasswordLegacyRequest(BaseModel):
    email: str = Field(min_length=3, max_length=254)


class ForgotPasswordOtpVerifyRequest(BaseModel):
    identifier: str = Field(min_length=3, max_length=254, description="Registered email or phone")
    otp: str = Field(min_length=4, max_length=8)


class ForgotPasswordOtpGenerateResponse(BaseModel):
    message: str


class ForgotPasswordOtpVerifyResponse(BaseModel):
    message: str
    reset_token: str


class ResetPasswordRequest(BaseModel):
    token: str = Field(min_length=8, max_length=200)
    password: str = Field(min_length=8, max_length=256)


class MessageResponse(BaseModel):
    message: str


class UserRoleUpdateRequest(BaseModel):
    role: str = Field(min_length=1, max_length=40)


class UserResponse(BaseModel):
    id: str
    email: str
    username: str
    full_name: str
    phone: str | None = None
    role: str
    is_active: bool
    is_verified: bool
    tenant_id: str | None = None


class AuthResponse(BaseModel):
    user: UserResponse
    access_token: str
    refresh_token: str
    token_type: Literal["bearer"] = "bearer"
    expires_in: int

