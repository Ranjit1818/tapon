from fastapi import APIRouter, HTTPException, Depends, status, Request
from app.models.analytics import Analytics
from app.models.profile import Profile
from app.schemas.analytics import AnalyticsRecord, AnalyticsResponse
from app.auth.deps import get_current_user
from app.models.user import User
from typing import Optional

router = APIRouter()

@router.post("/record", status_code=status.HTTP_201_CREATED)
async def record_event(
    record: AnalyticsRecord,
    request: Request,
    current_user: Optional[User] = Depends(get_current_user) # Optional auth
):
    ip = request.client.host
    
    metadata = record.metadata or {}
    metadata['ipAddress'] = ip
    metadata['userAgent'] = request.headers.get('user-agent')
    
    analytics = Analytics(
        user=current_user.id if current_user else None,
        profile=record.profileId,
        qrCode=record.qrCodeId,
        eventType=record.eventType,
        eventCategory=record.eventCategory,
        eventAction=record.eventAction,
        metadata=metadata,
        session=record.session or {},
        userJourney=record.userJourney or {},
        performance=record.performance or {},
        conversion=record.conversion or {}
    )
    await analytics.save()
    
    # Update profile counters
    if record.profileId:
        inc = {}
        if record.eventType == 'profile_view': inc['profileViews'] = 1
        # Add others..
        if inc:
             # Need to implement inc logic if using raw update or fetch doc
             pass

    return {"success": True, "id": str(analytics.id)}
