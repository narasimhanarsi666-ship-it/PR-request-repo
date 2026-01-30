from dataclasses import dataclass, field
from datetime import datetime
from typing import List


@dataclass
class OrderItem:
    sku: str
    name: str
    price: float
    qty: int

    def to_dict(self):
        return {
            "sku": self.sku,
            "name": self.name,
            "price": self.price,
            "qty": self.qty,
        }


@dataclass
class Order:
    order_id: str
    user_id: str
    items: List[OrderItem]
    subtotal: float
    discount: float
    tax: float
    shipping: float
    total: float
    payment_method: str
    transaction_id: str | None
    status: str  # CREATED, PAID, FAILED
    created_at: datetime = field(default_factory=datetime.utcnow)

    def to_dict(self):
        return {
            "order_id": self.order_id,
            "user_id": self.user_id,
            "items": [i.to_dict() for i in self.items],
            "totals": {
                "subtotal": self.subtotal,
                "discount": self.discount,
                "tax": self.tax,
                "shipping": self.shipping,
                "total": self.total,
            },
            "payment_method": self.payment_method,
            "transaction_id": self.transaction_id,
            "status": self.status,
            "created_at": self.created_at.isoformat(),
        }
