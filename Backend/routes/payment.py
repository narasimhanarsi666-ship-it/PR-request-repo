from flask import Blueprint, request, jsonify

from services.cart_service import CartService
from services.inventory_service import InventoryService
from services.order_service import OrderService
from services.payment_service import PaymentService###

payment_bp = Blueprint("payment", __name__)

cart_service = CartService()
inventory_service = InventoryService()
order_service = OrderService()
payment_service = PaymentService()


@payment_bp.route("/<user_id>/pay", methods=["POST"])
def process_payment(user_id):
    data = request.json or {}
    payment_method = data.get("payment_method")

    if not payment_method:
        return jsonify({"error": "payment_method is required"}), 400

    # Get cart snapshot
    cart = cart_service.get_cart(user_id)
    if not cart["items"]:
        return jsonify({"error": "Cart is empty"}), 400

    # Reserve inventory
    try:
        inventory_service.validate_and_reserve(cart["items"])
    except ValueError as e:
        return jsonify({"error": str(e)}), 400

    # Process payment
    payment_result = payment_service.process_payment(
        payment_method, cart["total"]
    )

    if not payment_result["success"]:
        # Rollback inventory
        inventory_service.release(cart["items"])
        return jsonify({
            "error": payment_result["error"],
            "retryable": True
        }), 402

    # Create order
    order = order_service.create_order(
        user_id=user_id,
        items=cart["items"],
        totals=cart,
        payment_method=payment_method["type"],
        transaction_id=payment_result["transaction_id"],
        status="PAID",
    )

    # Clear cart after successful order
    cart_service.clear_cart(user_id)

    return jsonify({
        "ok": True,
        **order.to_dict()
    })

