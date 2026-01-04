from typing import Optional, List, Dict, Any
from pydantic import BaseModel
from datetime import datetime
from app.schemas.profile import ProfileResponse
from app.schemas.user import UserResponse

class QRCreate(BaseModel):
    name: str
    type: str = "profile"
    profile: str # Profile ID
    data: Dict[str, Any] # Contains content for generation
    settings: Optional[Dict[str, Any]] = None

class QRUpdate(BaseModel):
    name: Optional[str] = None
    isActive: Optional[bool] = None
    settings: Optional[Dict[str, Any]] = None
    data: Optional[Dict[str, Any]] = None

class QRResponse(BaseModel):
    id: str
    user: Optional[str] = None # can be string id or object depending on populate
    profile: Optional[str] = None 
    name: str
    type: str
    qrData: str
    qrImage: Optional[str] = None
    logo: Optional[str] = None
    scanCount: int
    isActive: bool
    settings: Dict[str, Any]
    created_at: datetime
    
    class Config:
        json_encoders = {datetime: lambda v: v.isoformat()}
