from typing import List, Optional
from fastapi import APIRouter, HTTPException, Depends, status, Query
from app.models.qr import QRCode
from app.models.profile import Profile
from app.models.user import User
from app.schemas.qr import QRCreate, QRUpdate, QRResponse
from app.auth.deps import get_current_user
from beanie import PydanticObjectId
import qrcode
import io
import base64

router = APIRouter()

async def generate_qr_data(type: str, data: dict, profile_username: str = None) -> str:
    # Simplified version of logic from express controller
    if type == 'profile':
        # Default fallback
        return f"http://localhost:3000/profile/{profile_username}" 
    # Add other types as needed
    return data.get('content', {}).get('url', '')

@router.get("/", response_model=List[QRResponse])
async def get_qr_codes(
    current_user: User = Depends(get_current_user),
    limit: int = 10,
    skip: int = 0
):
    qrcodes = await QRCode.find(QRCode.user == current_user.id).limit(limit).skip(skip).to_list()
    return [QRResponse(**q.dict(), id=str(q.id), user=str(q.user), profile=str(q.profile)) for q in qrcodes]

@router.post("/", response_model=QRResponse, status_code=status.HTTP_201_CREATED)
async def create_qr_code(
    qr_in: QRCreate,
    current_user: User = Depends(get_current_user)
):
    profile = await Profile.get(PydanticObjectId(qr_in.profile))
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    qr_data_str = await generate_qr_data(qr_in.type, qr_in.data, profile.username or str(profile.id))
    
    qr_code = QRCode(
        user=current_user.id,
        profile=profile.id,
        name=qr_in.name,
        type=qr_in.type,
        qrData=qr_data_str,
        settings=qr_in.settings or {}
    )
    await qr_code.save()
    
    return QRResponse(**qr_code.dict(), id=str(qr_code.id), user=str(qr_code.user), profile=str(qr_code.profile))

@router.get("/{id}", response_model=QRResponse)
async def get_qr_code(
    id: PydanticObjectId,
    current_user: User = Depends(get_current_user)
):
    qr = await QRCode.get(id)
    if not qr:
        raise HTTPException(status_code=404, detail="QR Code not found")
    
    if qr.user != current_user.id and current_user.role != 'admin':
         raise HTTPException(status_code=403, detail="Not authorized")
         
    return QRResponse(**qr.dict(), id=str(qr.id), user=str(qr.user), profile=str(qr.profile))

@router.put("/{id}", response_model=QRResponse)
async def update_qr_code(
    id: PydanticObjectId,
    qr_in: QRUpdate,
    current_user: User = Depends(get_current_user)
):
    qr = await QRCode.get(id)
    if not qr:
        raise HTTPException(status_code=404, detail="QR Code not found")

    if qr.user != current_user.id and current_user.role != 'admin':
         raise HTTPException(status_code=403, detail="Not authorized")
    
    update_data = qr_in.dict(exclude_unset=True)
    await qr.update({"$set": update_data})
    
    return QRResponse(**qr.dict(), id=str(qr.id), user=str(qr.user), profile=str(qr.profile))

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_qr_code(
    id: PydanticObjectId,
    current_user: User = Depends(get_current_user)
):
    qr = await QRCode.get(id)
    if not qr:
         raise HTTPException(status_code=404, detail="QR Code not found")
         
    if qr.user != current_user.id and current_user.role != 'admin':
         raise HTTPException(status_code=403, detail="Not authorized")
         
    await qr.delete()
    return None
