from typing import List
from fastapi import APIRouter, HTTPException, Depends, status
from app.models.profile import Profile
from app.models.user import User
from app.schemas.profile import ProfileCreate, ProfileUpdate, ProfileResponse
from app.auth.deps import get_current_user
from beanie import PydanticObjectId

router = APIRouter()

@router.get("/", response_model=List[ProfileResponse])
async def get_my_profiles(current_user: User = Depends(get_current_user)):
    profiles = await Profile.find(Profile.user == current_user.id).to_list()
    return [
        ProfileResponse(
            id=str(p.id),
            user=str(p.user),
            displayName=p.displayName,
            username=p.username,
            bio=p.bio,
            jobTitle=p.jobTitle,
            company=p.company,
            location=p.location,
            website=p.website,
            avatar=p.avatar,
            theme=p.theme,
            isPublic=p.isPublic,
            socialLinks=p.socialLinks,
            contactInfo=p.contactInfo,
            customFields=p.customFields,
            settings=p.settings
        ) for p in profiles
    ]

@router.post("/", response_model=ProfileResponse)
async def create_profile(profile_in: ProfileCreate, current_user: User = Depends(get_current_user)):
    profile = Profile(
        user=current_user.id,
        **profile_in.dict()
    )
    await profile.save()
    
    return ProfileResponse(
        id=str(profile.id),
        user=str(profile.user),
        displayName=profile.displayName,
        username=profile.username,
        bio=profile.bio,
        jobTitle=profile.jobTitle,
        company=profile.company,
        location=profile.location,
        website=profile.website,
        avatar=profile.avatar,
        theme=profile.theme,
        isPublic=profile.isPublic,
        socialLinks=profile.socialLinks,
        contactInfo=profile.contactInfo,
        customFields=profile.customFields,
        settings=profile.settings
    )

@router.get("/{profile_id}", response_model=ProfileResponse)
async def get_profile(profile_id: PydanticObjectId):
    profile = await Profile.get(profile_id)
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
        
    return ProfileResponse(
        id=str(profile.id),
        user=str(profile.user),
        displayName=profile.displayName,
        username=profile.username,
        bio=profile.bio,
        jobTitle=profile.jobTitle,
        company=profile.company,
        location=profile.location,
        website=profile.website,
        avatar=profile.avatar,
        theme=profile.theme,
        isPublic=profile.isPublic,
        socialLinks=profile.socialLinks,
        contactInfo=profile.contactInfo,
        customFields=profile.customFields,
        settings=profile.settings
    )

@router.put("/{profile_id}", response_model=ProfileResponse)
async def update_profile(
    profile_id: PydanticObjectId, 
    profile_in: ProfileUpdate, 
    current_user: User = Depends(get_current_user)
):
    profile = await Profile.get(profile_id)
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
        
    if profile.user != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized to update this profile")
    
    update_data = profile_in.dict(exclude_unset=True)
    await profile.update({"$set": update_data})
    
    return ProfileResponse(
        id=str(profile.id),
        user=str(profile.user),
        displayName=profile.displayName, # Should re-fetch or update object locally, but for now simple
        username=profile.username,
        bio=profile.bio,
        jobTitle=profile.jobTitle,
        company=profile.company,
        location=profile.location,
        website=profile.website,
        avatar=profile.avatar,
        theme=profile.theme,
        isPublic=profile.isPublic,
        socialLinks=profile.socialLinks,
        contactInfo=profile.contactInfo,
        customFields=profile.customFields,
        settings=profile.settings
    )
    
@router.get("/username/{username}", response_model=ProfileResponse)
async def get_profile_by_username(username: str):
    profile = await Profile.find_one(Profile.username == username)
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
        
    if not profile.isPublic:
        raise HTTPException(status_code=403, detail="Profile is private")
        
    return ProfileResponse(
        id=str(profile.id),
        user=str(profile.user),
        displayName=profile.displayName,
        username=profile.username,
        bio=profile.bio,
        jobTitle=profile.jobTitle,
        company=profile.company,
        location=profile.location,
        website=profile.website,
        avatar=profile.avatar,
        theme=profile.theme,
        isPublic=profile.isPublic,
        socialLinks=profile.socialLinks,
        contactInfo=profile.contactInfo,
        customFields=profile.customFields,
        settings=profile.settings
    )
