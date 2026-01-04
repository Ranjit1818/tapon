from typing import Optional, List
from datetime import datetime
from beanie import Document, Indexed
from pydantic import Field, EmailStr
from enum import Enum

class UserRole(str, Enum):
    USER = "user"
    ADMIN = "admin"
    SUPER_ADMIN = "super_admin"

class UserStatus(str, Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    SUSPENDED = "suspended"

class User(Document):
    name: str = Field(..., max_length=50)
    email: Indexed(EmailStr, unique=True)
    password: str
    role: UserRole = UserRole.USER
    status: UserStatus = UserStatus.ACTIVE
    permissions: List[str] = ["profile_edit", "profile_view", "qr_generate"]
    
    isLocked: bool = False
    loginAttempts: int = 0
    lockUntil: Optional[datetime] = None
    lastLogin: Optional[datetime] = None
    
    resetPasswordToken: Optional[str] = None
    resetPasswordExpire: Optional[datetime] = None
    
    emailVerified: bool = False
    emailVerificationToken: Optional[str] = None
    emailVerificationExpire: Optional[datetime] = None
    
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "users"
        
    async def inc_login_attempts(self):
        if self.lock_until and self.lock_until < datetime.utcnow():
            self.loginAttempts = 1
            self.lockUntil = None
            self.isLocked = False
            await self.save()
            return

        self.loginAttempts += 1
        # if self.loginAttempts >= 5:
        #     self.isLocked = True
        #     self.lockUntil = datetime.utcnow() + timedelta(hours=2)
        await self.save()

    async def reset_login_attempts(self):
        self.loginAttempts = 0
        self.lockUntil = None
        self.isLocked = False
        await self.save()
