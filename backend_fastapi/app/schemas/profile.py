from typing import Optional, List
from pydantic import BaseModel
from app.models.profile import SocialLinks, ContactInfo, CustomField, ProfileSettings

class ProfileCreate(BaseModel):
    displayName: str
    username: Optional[str] = None
    bio: Optional[str] = None

class ProfileUpdate(BaseModel):
    displayName: Optional[str] = None
    username: Optional[str] = None
    bio: Optional[str] = None
    jobTitle: Optional[str] = None
    company: Optional[str] = None
    location: Optional[str] = None
    website: Optional[str] = None
    avatar: Optional[str] = None
    theme: Optional[str] = None
    isPublic: Optional[bool] = None
    socialLinks: Optional[SocialLinks] = None
    contactInfo: Optional[ContactInfo] = None
    customFields: Optional[List[CustomField]] = None
    settings: Optional[ProfileSettings] = None

class ProfileResponse(BaseModel):
    id: str
    user: str
    displayName: str
    username: Optional[str] = None
    bio: Optional[str] = None
    jobTitle: Optional[str] = None
    company: Optional[str] = None
    location: Optional[str] = None
    website: Optional[str] = None
    avatar: Optional[str] = None
    theme: str
    isPublic: bool
    socialLinks: Optional[SocialLinks] = None
    contactInfo: Optional[ContactInfo] = None
    customFields: Optional[List[CustomField]] = None
    settings: Optional[ProfileSettings] = None
