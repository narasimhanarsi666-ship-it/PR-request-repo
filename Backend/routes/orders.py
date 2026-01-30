from flask import Blueprint, jsonify, request

from services.order_service import OrderService

orders_bp = Blueprint("orders", __name__)
order_service = OrderService()


@orders_bp.route("/<order_id>", methods=["GET"])
def get_order(order_id):
    """
    Fetch a single order by order_id.
    Used for order confirmation reloads.
    """
    order = order_service.get_order(order_id)
    if not order:
        return jsonify({"error": "Order not found"}), 404

    return jsonify(order.to_dict())


@orders_bp.route("/user/<user_id>", methods=["GET"])
def list_orders_for_user(user_id):
    """
    Fetch all orders for a user.
    Frontend can use this for order history.
    """
    orders = order_service.list_orders_for_user(user_id)
    return jsonify({
        "count": len(orders),
        "orders": orders
    })
