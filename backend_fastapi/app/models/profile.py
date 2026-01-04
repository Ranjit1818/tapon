from typing import Optional, List, Dict
from datetime import datetime
from beanie import Document, Indexed, PydanticObjectId
from pydantic import BaseModel, Field

class SocialLinks(BaseModel):
    website: Optional[str] = None
    linkedin: Optional[str] = None
    twitter: Optional[str] = None
    instagram: Optional[str] = None
    facebook: Optional[str] = None
    youtube: Optional[str] = None
    github: Optional[str] = None

class ContactInfo(BaseModel):
    email: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None

class CustomFieldType(BaseModel):
    type: str = "text" # text, link, email, phone

class CustomField(BaseModel):
    label: Optional[str] = None
    value: Optional[str] = None
    type: str = "text"

class ProfileSettings(BaseModel):
    showEmail: bool = False
    showPhone: bool = False
    allowContact: bool = True
    analyticsEnabled: bool = True

class Profile(Document):
    user: Indexed(PydanticObjectId)
    displayName: str = Field(..., max_length=100)
    username: Optional[Indexed(str, unique=True, sparse=True)] = None
    bio: Optional[str] = Field(None, max_length=500)
    jobTitle: Optional[str] = Field(None, max_length=100)
    company: Optional[str] = Field(None, max_length=100)
    location: Optional[str] = Field(None, max_length=100)
    website: Optional[str] = None
    avatar: Optional[str] = None
    theme: str = "default"
    isPublic: bool = True
    
    socialLinks: SocialLinks = SocialLinks()
    contactInfo: ContactInfo = ContactInfo()
    customFields: List[CustomField] = []
    settings: ProfileSettings = ProfileSettings()
    
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "profiles"
