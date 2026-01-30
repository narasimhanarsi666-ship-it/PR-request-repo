from flask import Flask, jsonify
from flask_cors import CORS

from routes.cart import cart_bp
from routes.checkout import checkout_bp
from routes.payment import payment_bp
from routes.orders import orders_bp


def create_app():
    app = Flask(__name__)
    app.config["JSON_SORT_KEYS"] = False

    # Enable CORS for frontend
    CORS(app, resources={r"/*": {"origins": "*"}})

    # Register blueprints
    app.register_blueprint(cart_bp, url_prefix="/api/cart")
    app.register_blueprint(checkout_bp, url_prefix="/api/checkout")
    app.register_blueprint(payment_bp, url_prefix="/api/payment")
    app.register_blueprint(orders_bp, url_prefix="/api/orders")

    # Global error handler
    @app.errorhandler(Exception)
    def handle_exception(e):
        return jsonify({
            "error": "Internal Server Error",
            "message": str(e)
        }), 500

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(debug=True, port=8001)
