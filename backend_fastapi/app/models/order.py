from typing import Optional, List, Dict
from datetime import datetime
from beanie import Document, Indexed, PydanticObjectId
from pydantic import BaseModel, Field
from enum import Enum

class OrderStatus(str, Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    SHIPPED = "shipped"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"

class PaymentStatus(str, Enum):
    PENDING = "pending"
    PAID = "paid"
    FAILED = "failed"
    REFUNDED = "refunded"

class ShippingAddress(BaseModel):
    firstName: Optional[str] = None
    lastName: Optional[str] = None
    company: Optional[str] = None
    address1: Optional[str] = None
    address2: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    postalCode: Optional[str] = None
    country: Optional[str] = None
    phone: Optional[str] = None

class OrderItem(BaseModel):
    productType: str
    quantity: int
    unitPrice: float
    # Add other item fields as needed based on frontend

class OrderNote(BaseModel):
    message: str
    addedBy: PydanticObjectId
    addedAt: datetime = Field(default_factory=datetime.utcnow)

class Order(Document):
    user: Indexed(PydanticObjectId)
    orderNumber: Indexed(str, unique=True)
    productType: str
    quantity: int
    items: List[OrderItem] = [] # Added to store line items
    totalAmount: float
    status: OrderStatus = OrderStatus.PENDING
    shippingAddress: ShippingAddress = ShippingAddress()
    paymentStatus: PaymentStatus = PaymentStatus.PENDING
    stripePaymentIntentId: Optional[str] = None
    trackingNumber: Optional[str] = None
    estimatedDelivery: Optional[datetime] = None
    notes: List[OrderNote] = [] # Changed from string to list based on controller usage
    
    paymentMethod: Optional[str] = None
    paymentTransactionId: Optional[str] = None
    paidAt: Optional[datetime] = None
    
    cancelledAt: Optional[datetime] = None
    cancellationReason: Optional[str] = None
    
    refundedAt: Optional[datetime] = None
    refundReason: Optional[str] = None
    refundAmount: Optional[float] = None

    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "orders"
