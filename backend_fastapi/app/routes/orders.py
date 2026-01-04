from typing import List
from fastapi import APIRouter, HTTPException, Depends, status
from app.models.order import Order, OrderStatus, ShippingAddress
from app.models.user import User
from app.schemas.order import OrderCreate, OrderUpdate, OrderResponse, OrderStatusUpdate
from app.auth.deps import get_current_user
from beanie import PydanticObjectId
import random
import time

router = APIRouter()

@router.get("/", response_model=List[OrderResponse])
async def get_orders(
    current_user: User = Depends(get_current_user),
    limit: int = 10,
    skip: int = 0
):
    orders = await Order.find(Order.user == current_user.id).sort(-Order.created_at).limit(limit).skip(skip).to_list()
    # Simple conversion, deeper if needed for ShippingAddress etc
    return [OrderResponse(**o.dict(), id=str(o.id), user=str(o.user)) for o in orders]

@router.post("/", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
async def create_order(
    order_in: OrderCreate,
    current_user: User = Depends(get_current_user)
):
    # Calculate totals
    total_amount = sum(item.quantity * item.unitPrice for item in order_in.items)
    total_quantity = sum(item.quantity for item in order_in.items)
    
    # Determine main product type
    product_type = order_in.items[0].productType if order_in.items else 'nfc_card'
    
    # Address mapping
    addr = order_in.shipping.get('address', {})
    customer_name = order_in.customerInfo.get('name', '')
    first_name = customer_name.split(' ')[0] if customer_name else ''
    last_name = ' '.join(customer_name.split(' ')[1:]) if customer_name else ''
    
    shipping_address = ShippingAddress(
        firstName=first_name,
        lastName=last_name,
        address1=addr.get('street') or addr.get('address1'),
        address2=addr.get('address2'),
        city=addr.get('city'),
        state=addr.get('state'),
        postalCode=addr.get('zipCode') or addr.get('postalCode'),
        country=addr.get('country'),
        phone=order_in.customerInfo.get('phone')
    )
    
    order_number = f"TAP-{int(time.time())}-{random.randint(1000, 9999)}"
    
    order = Order(
        user=current_user.id,
        orderNumber=order_number,
        productType=product_type,
        quantity=total_quantity,
        items=order_in.items, # Beanie should handle sub-models
        totalAmount=total_amount,
        shippingAddress=shipping_address
    )
    await order.save()
    
    return OrderResponse(**order.dict(), id=str(order.id), user=str(order.user))
