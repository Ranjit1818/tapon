from typing import Optional, List, Dict, Any
from pydantic import BaseModel
from datetime import datetime
from app.models.order import OrderStatus, PaymentStatus, ShippingAddress, OrderItem

class OrderCreate(BaseModel):
    items: List[OrderItem]
    shipping: Dict[str, Any] # Nested structure from frontend
    customerInfo: Dict[str, Any]

class OrderUpdate(BaseModel):
    shippingAddress: Optional[ShippingAddress] = None
    notes: Optional[str] = None # For simplicity in update

class OrderStatusUpdate(BaseModel):
    status: OrderStatus
    note: Optional[str] = None

class OrderResponse(BaseModel):
    id: str
    user: Optional[str] = None
    orderNumber: str
    productType: str
    quantity: int
    totalAmount: float
    status: OrderStatus
    paymentStatus: PaymentStatus
    trackingNumber: Optional[str] = None
    estimatedDelivery: Optional[datetime] = None
    created_at: datetime

    class Config:
        json_encoders = {datetime: lambda v: v.isoformat()}
