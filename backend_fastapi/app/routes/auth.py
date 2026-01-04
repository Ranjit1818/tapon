from fastapi import APIRouter, HTTPException, Depends, status
from app.models.user import User
from app.models.profile import Profile
from app.schemas.user import UserCreate, UserLogin, UserResponse, Token
from app.auth.security import get_password_hash, verify_password
from app.auth.jwt import create_access_token
from app.auth.deps import get_current_user
from beanie import PydanticObjectId

router = APIRouter()

@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
async def register(user_in: UserCreate):
    existing_user = await User.find_one(User.email == user_in.email)
    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="User already exists with this email"
        )
    
    # Create user
    hashed_password = get_password_hash(user_in.password)
    user = User(
        name=user_in.name,
        email=user_in.email,
        password=hashed_password
    )
    await user.save()
    
    # Create unique username
    base_username = user_in.name.lower().replace(" ", "")
    import random
    suffix = random.randint(1000, 9999)
    username = f"{base_username}{suffix}"
    
    # Ensure uniqueness (simple check)
    while await Profile.find_one(Profile.username == username):
        suffix = random.randint(1000, 9999)
        username = f"{base_username}{suffix}"

    # Create default profile
    profile = Profile(
        user=user.id,
        displayName=user.name,
        username=username
    )
    await profile.save()

    # Create default QR code
    from app.models.qr import QRCode
    from app.config import settings
    
    frontend_url = settings.FRONTEND_URL
    profile_url = f"{frontend_url}/p/{username}"
    
    qr_code = QRCode(
        user=user.id,
        profile=profile.id,
        name=f"{user.name} QR Code",
        type="profile",
        qrData=profile_url,
        isActive=True
    )
    await qr_code.save()
    
    # Create token
    access_token = create_access_token(subject=user.id)
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": UserResponse(
            id=str(user.id),
            name=user.name,
            email=user.email,
            role=user.role,
            status=user.status,
            permissions=user.permissions,
            created_at=user.created_at
        )
    }

@router.post("/login", response_model=Token)
async def login(user_in: UserLogin):
    user = await User.find_one(User.email == user_in.email)
    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid credentials"
        )
        
    if not verify_password(user_in.password, user.password):
        await user.inc_login_attempts()
        raise HTTPException(
            status_code=401,
            detail="Invalid credentials"
        )
    
    await user.reset_login_attempts()
    # update last login
    user.lastLogin = user.updated_at # quick fix using current time
    await user.save()

    access_token = create_access_token(subject=user.id)
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": UserResponse(
            id=str(user.id),
            name=user.name,
            email=user.email,
            role=user.role,
            status=user.status,
            permissions=user.permissions,
            created_at=user.created_at
        )
    }

@router.get("/me", response_model=UserResponse)
async def read_users_me(current_user: User = Depends(get_current_user)):
    return UserResponse(
        id=str(current_user.id),
        name=current_user.name,
        email=current_user.email,
        role=current_user.role,
        status=current_user.status,
        permissions=current_user.permissions,
        created_at=current_user.created_at
    )
