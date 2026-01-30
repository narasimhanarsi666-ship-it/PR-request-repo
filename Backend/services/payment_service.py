from uuid import uuid4
from random import random


class PaymentService:
    def process_payment(self, payment_method: dict, amount: float) -> dict:
        """
        Simulates payment processing.
        In real systems this integrates with gateways (Stripe, Razorpay, etc.)
        """

        method = payment_method.get("type")

        if method not in ["cod", "card", "upi"]:
            return {
                "success": False,
                "error": "Unsupported payment method"
            }

        # COD always succeeds
        if method == "cod":
            return {
                "success": True,
                "transaction_id": f"COD-{uuid4()}"
            }

        # Simulate gateway behaviour for card / UPI
        failure_chance = 0.15  # 15% failure rate (realistic)
        if random() < failure_chance:
            return {
                "success": False,
                "error": "Payment declined by bank"
            }

        return {
            "success": True,
            "transaction_id": f"{method.upper()}-{uuid4()}"
        }
