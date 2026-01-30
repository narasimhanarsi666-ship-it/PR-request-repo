from dataclasses import dataclass, field
from datetime import datetime
###

@dataclass
class Product:
    sku: str
    name: str
    price: float
    stock: int
    active: bool = True
    created_at: datetime = field(default_factory=datetime.utcnow)

    def is_available(self, qty: int) -> bool:
        return self.active and self.stock >= qty

    def reserve(self, qty: int):
        if qty > self.stock:
            raise ValueError("Insufficient stock")
        self.stock -= qty

    def to_dict(self):
        return {
            "sku": self.sku,
            "name": self.name,
            "price": self.price,
            "stock": self.stock,
            "active": self.active,
        }

