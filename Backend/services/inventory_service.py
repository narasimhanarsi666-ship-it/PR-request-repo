from typing import Dict
from models.product import Product
###

# In-memory product catalog (replace with DB later)
_PRODUCTS: Dict[str, Product] = {
    "SKU001": Product("SKU001", "Running Shoes", 1200.0, stock=10),
    "SKU002": Product("SKU002", "Backpack", 800.0, stock=5),
    "SKU003": Product("SKU003", "Headphones", 1500.0, stock=8),
}


class InventoryService:
    def validate_and_reserve(self, items: list):
        """
        Validates stock and reserves items.
        If any item fails, entire operation fails.
        """
        # First pass: validate
        for item in items:
            sku = item["sku"]
            qty = item["qty"]

            product = _PRODUCTS.get(sku)
            if not product:
                raise ValueError(f"Product {sku} not found")

            if not product.is_available(qty):
                raise ValueError(f"Insufficient stock for {sku}")

        # Second pass: reserve
        for item in items:
            _PRODUCTS[item["sku"]].reserve(item["qty"])

    def release(self, items: list):
        """Rollback stock reservation (on payment failure)"""
        for item in items:
            product = _PRODUCTS.get(item["sku"])
            if product:
                product.stock += item["qty"]

