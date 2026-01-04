from typing import Optional, List, Dict, Any
from pydantic import BaseModel
from datetime import datetime

class AnalyticsRecord(BaseModel):
    eventType: str
    eventCategory: str = "engagement"
    eventAction: str
    profileId: Optional[str] = None
    qrCodeId: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None
    session: Optional[Dict[str, Any]] = None
    userJourney: Optional[Dict[str, Any]] = None
    performance: Optional[Dict[str, Any]] = None
    conversion: Optional[Dict[str, Any]] = None

class AnalyticsResponse(BaseModel):
    id: str
    eventType: str
    eventAction: str
    created_at: datetime

    class Config:
        json_encoders = {datetime: lambda v: v.isoformat()}
