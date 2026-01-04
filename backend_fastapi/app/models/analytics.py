from typing import Optional, List, Dict, Any
from datetime import datetime
from beanie import Document, Indexed, PydanticObjectId
from pydantic import BaseModel, Field

class Location(BaseModel):
    country: Optional[str] = None
    region: Optional[str] = None
    city: Optional[str] = None
    timezone: Optional[str] = None

class AnalyticsMetadata(BaseModel):
    ipAddress: Optional[str] = None
    userAgent: Optional[str] = None
    referrer: Optional[str] = None
    device: Optional[str] = None
    location: Location = Location()
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    sessionId: Optional[str] = None
    source: Optional[str] = None
    platform: Optional[str] = None
    browser: Optional[str] = None
    language: Optional[str] = None

class Analytics(Document):
    user: Optional[Indexed(PydanticObjectId)] = None
    profile: Optional[Indexed(PydanticObjectId)] = None
    qrCode: Optional[Indexed(PydanticObjectId)] = None
    eventType: str
    eventCategory: str = "engagement"
    eventAction: str
    metadata: AnalyticsMetadata = AnalyticsMetadata()
    session: Dict[str, Any] = {}
    userJourney: Dict[str, Any] = {}
    performance: Dict[str, Any] = {}
    conversion: Dict[str, Any] = {}

    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "analytics"
