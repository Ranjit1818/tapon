from typing import Optional, List, Dict
from datetime import datetime
from beanie import Document, Indexed, PydanticObjectId
from pydantic import BaseModel, Field

class QRSettings(BaseModel):
    size: int = 200
    foregroundColor: str = "#000000"
    backgroundColor: str = "#FFFFFF"
    errorCorrectionLevel: str = "M"
    margin: int = 4
    expiresAt: Optional[datetime] = None
    maxScans: Optional[int] = None

class ScanHistoryItem(BaseModel):
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    ipAddress: Optional[str] = None
    userAgent: Optional[str] = None
    location: Optional[str] = None
    device: Optional[str] = None

class QRAnalytics(BaseModel):
    totalScans: int = 0
    uniqueScans: int = 0
    lastScannedAt: Optional[datetime] = None
    scanHistory: List[ScanHistoryItem] = []

class QRCode(Document):
    user: Indexed(PydanticObjectId)
    profile: Indexed(PydanticObjectId)
    name: str = Field(..., max_length=100)
    type: str = "profile"
    qrData: str
    qrImage: Optional[str] = None
    logo: Optional[str] = None
    scanCount: int = 0
    isActive: bool = True
    settings: QRSettings = QRSettings()
    analytics: QRAnalytics = QRAnalytics()
    
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "qrcodes"
