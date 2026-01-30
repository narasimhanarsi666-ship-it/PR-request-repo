from flask import Blueprint, request, jsonify
from services.cart_service import CartService

cart_bp = Blueprint("cart", __name__)
cart_service = CartService()


@cart_bp.route("/<user_id>", methods=["GET"])
def get_cart(user_id):
    coupon_code = request.args.get("coupon_code", "")
    cart = cart_service.get_cart(user_id)

    # rebuild totals if coupon is applied
    cart = cart_service._build_cart_response(
        cart["items"], coupon_code=coupon_code
    )
    return jsonify(cart)


@cart_bp.route("/<user_id>/add", methods=["POST"])
def add_to_cart(user_id):
    data = request.json or {}

    required = ["sku", "name", "price", "qty"]
    for field in required:
        if field not in data:
            return jsonify({"error": f"{field} is required"}), 400

    try:
        cart_service.add_item(user_id, data)
        return jsonify({"ok": True})
    except ValueError as e:
        return jsonify({"error": str(e)}), 400


@cart_bp.route("/<user_id>/update", methods=["POST"])
def update_cart(user_id):
    data = request.json or {}

    if "sku" not in data or "qty" not in data:
        return jsonify({"error": "sku and qty are required"}), 400

    try:
        cart_service.update_qty(user_id, data["sku"], int(data["qty"]))
        return jsonify({"ok": True})
    except ValueError as e:
        return jsonify({"error": str(e)}), 400


@cart_bp.route("/<user_id>/remove", methods=["POST"])
def remove_from_cart(user_id):
    data = request.json or {}

    if "sku" not in data:
        return jsonify({"error": "sku is required"}), 400

    cart_service.remove_item(user_id, data["sku"])
    return jsonify({"ok": True})
