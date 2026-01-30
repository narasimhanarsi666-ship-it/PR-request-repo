from flask import Blueprint, request, jsonify

from services.cart_service import CartService###
from services.inventory_service import InventoryService

checkout_bp = Blueprint("checkout", __name__)

cart_service = CartService()
inventory_service = InventoryService()


def _validate_shipping(shipping: dict) -> list:
    errors = []

    if not shipping.get("name"):
        errors.append("Name is required")
    if not shipping.get("email"):
        errors.append("Email is required")
    if not shipping.get("address"):
        errors.append("Address is required")
    if not shipping.get("city"):
        errors.append("City is required")
    if not shipping.get("pin") or len(str(shipping["pin"])) != 6:
        errors.append("Valid PIN is required")

    return errors


@checkout_bp.route("/<user_id>/validate", methods=["POST"])
def validate_checkout(user_id):
    data = request.json or {}
    shipping = data.get("shipping", {})
    payment_method = data.get("payment_method", {})

    errors = _validate_shipping(shipping)

    if not payment_method:
        errors.append("Payment method is required")

    cart = cart_service.get_cart(user_id)
    if not cart["items"]:
        errors.append("Cart is empty")

    if errors:
        return jsonify({"ok": False, "errors": errors}), 400

    return jsonify({"ok": True})


@checkout_bp.route("/<user_id>/prepare", methods=["POST"])
def prepare_checkout(user_id):
    """
    Optional future endpoint:
    Locks inventory, recalculates totals
    """
    cart = cart_service.get_cart(user_id)

    try:
        inventory_service.validate_and_reserve(cart["items"])
    except ValueError as e:
        return jsonify({"error": str(e)}), 400

    return jsonify({
        "ok": True,
        "totals": {
            "subtotal": cart["subtotal"],
            "discount": cart["discount"],
            "tax": cart["tax"],
            "shipping": cart["shipping"],
            "total": cart["total"],
        }
    })

