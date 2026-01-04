from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from app.config import settings
from app.models.user import User
from app.models.profile import Profile
from app.models.qr import QRCode
from app.models.order import Order
from app.models.analytics import Analytics

async def init_db():
    client = AsyncIOMotorClient(settings.MONGO_URI)
    await init_beanie(
        database=client.get_default_database(), 
        document_models=[
            User, 
            Profile,
            QRCode,
            Order,
            Analytics
        ]
    )
