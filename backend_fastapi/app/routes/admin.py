from fastapi import APIRouter, HTTPException, Depends
from app.models.user import User, UserRole
from app.models.profile import Profile
from app.models.order import Order
from app.auth.deps import get_current_user
from typing import List

router = APIRouter()

def check_admin(user: User = Depends(get_current_user)):
    if user.role != UserRole.ADMIN and user.role != UserRole.SUPER_ADMIN:
        raise HTTPException(status_code=403, detail="Admin access required")
    return user

@router.get("/dashboard")
async def get_dashboard_stats(admin: User = Depends(check_admin)):
    total_users = await User.count()
    total_profiles = await Profile.count()
    total_orders = await Order.count()
    
    return {
        "success": True,
        "data": {
            "summary": {
                "totalUsers": total_users,
                "totalProfiles": total_profiles,
                "totalOrders": total_orders
            }
        }
    }
