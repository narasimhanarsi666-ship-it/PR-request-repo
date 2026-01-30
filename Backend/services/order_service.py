from typing import Dict, List
from uuid import uuid4

from models.order import Order, OrderItem

# In-memory order store
_ORDERS: Dict[str, Order] = {}


class OrderService:
    def create_order(
        self,
        user_id: str,
        items: list,
        totals: dict,
        payment_method: str,
        transaction_id: str | None,
        status: str,
    ) -> Order:
        order_id = str(uuid4())

        order_items: List[OrderItem] = [
            OrderItem(
                sku=i["sku"],
                name=i["name"],
                price=i["price"],
                qty=i["qty"],
            )
            for i in items
        ]

        order = Order(
            order_id=order_id,
            user_id=user_id,
            items=order_items,
            subtotal=totals["subtotal"],
            discount=totals["discount"],
            tax=totals["tax"],
            shipping=totals["shipping"],
            total=totals["total"],
            payment_method=payment_method,
            transaction_id=transaction_id,
            status=status,
        )

        _ORDERS[order_id] = order
        return order

    def get_order(self, order_id: str) -> Order | None:
        return _ORDERS.get(order_id)

    def list_orders_for_user(self, user_id: str) -> list:
        return [
            o.to_dict()
            for o in _ORDERS.values()
            if o.user_id == user_id
        ]
