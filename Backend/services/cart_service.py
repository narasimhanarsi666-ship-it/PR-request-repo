from typing import Dict, List
from uuid import uuid4
from uuid import uuid4

# Simple in-memory stores (replace with DB later)
_CARTS: Dict[str, List[dict]] = {}
_COUPONS = {
    "WELCOME10": 0.10,
    "HALF50": 0.50,
}

TAX_RATE = 0.18
SHIPPING_FEE = 50.0


class CartService:
    def get_cart(self, user_id: str) -> dict:
        items = _CARTS.get(user_id, [])
        return self._build_cart_response(items)

    def add_item(self, user_id: str, item: dict):
        if item["qty"] <= 0:
            raise ValueError("Quantity must be greater than zero")

        cart = _CARTS.setdefault(user_id, [])

        for existing in cart:
            if existing["sku"] == item["sku"]:
                existing["qty"] += item["qty"]
                return

        cart.append({
            "sku": item["sku"],
            "name": item["name"],
            "price": float(item["price"]),
            "qty": int(item["qty"]),
        })

    def update_qty(self, user_id: str, sku: str, qty: int):
        if qty <= 0:
            self.remove_item(user_id, sku)
            return

        cart = _CARTS.get(user_id, [])
        for item in cart:
            if item["sku"] == sku:
                item["qty"] = qty
                return

        raise ValueError("Item not found in cart")

    def remove_item(self, user_id: str, sku: str):
        cart = _CARTS.get(user_id, [])
        _CARTS[user_id] = [i for i in cart if i["sku"] != sku]

    def clear_cart(self, user_id: str):
        _CARTS.pop(user_id, None)

    def apply_coupon(self, coupon_code: str) -> float:
        if not coupon_code:
            return 0.0
        return _COUPONS.get(coupon_code.upper(), 0.0)

    def _build_cart_response(self, items: List[dict], coupon_code: str = "") -> dict:
        subtotal = sum(i["price"] * i["qty"] for i in items)
        discount_rate = self.apply_coupon(coupon_code)
        discount = subtotal * discount_rate
        taxable = subtotal - discount
        tax = taxable * TAX_RATE
        total = taxable + tax + SHIPPING_FEE if items else 0.0

        return {
            "items": items,
            "subtotal": round(subtotal, 2),
            "discount": round(discount, 2),
            "tax": round(tax, 2),
            "shipping": SHIPPING_FEE if items else 0.0,
            "total": round(total, 2),
            "coupon_applied": coupon_code.upper() if discount_rate > 0 else None,
        }

