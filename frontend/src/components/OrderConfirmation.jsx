function formatCurrency(value) {
  if (typeof value !== "number") return "—";
  return `₹${value.toFixed(2)}`;
}

export default function OrderConfirmation({ order }) {
  if (!order) {
    return (
      <div>
        <h2>Order Confirmation</h2>
        <p>Unable to load order details.</p>
      </div>
    );
  }

  const {
    order_id,
    transaction_id,
    totals = {},
  } = order;

  const {
    subtotal,
    discount,
    tax,
    shipping,
    total,
  } = totals;

  return (
    <div
      style={{
        padding: "24px",
        border: "1px solid #ddd",
        maxWidth: "500px",
      }}
    >
      <h2 style={{ color: "green" }}>✅ Order Confirmed</h2>

      <p>
        Thank you for your purchase! Your order has been placed
        successfully.
      </p>

      <div style={{ marginTop: "16px" }}>
        <strong>Order ID:</strong> {order_id}
        <br />
        <strong>Transaction ID:</strong>{" "}
        {transaction_id || "N/A"}
      </div>

      <hr style={{ margin: "16px 0" }} />

      <h3>Payment Summary</h3>

      <div>
        <span>Subtotal</span>
        <span style={{ float: "right" }}>
          {formatCurrency(subtotal)}
        </span>
      </div>

      {discount > 0 && (
        <div style={{ color: "green" }}>
          <span>Discount</span>
          <span style={{ float: "right" }}>
            −{formatCurrency(discount)}
          </span>
        </div>
      )}

      <div>
        <span>Tax</span>
        <span style={{ float: "right" }}>
          {formatCurrency(tax)}
        </span>
      </div>

      <div>
        <span>Shipping</span>
        <span style={{ float: "right" }}>
          {formatCurrency(shipping)}
        </span>
      </div>

      <hr />

      <div style={{ fontWeight: "bold" }}>
        <span>Total Paid</span>
        <span style={{ float: "right" }}>
          {formatCurrency(total)}
        </span>
      </div>

      <p style={{ marginTop: "12px", color: "#555" }}>
        A confirmation email will be sent shortly.
      </p>

      <div style={{ marginTop: "20px" }}>
        <button onClick={() => window.location.reload()}>
          Continue Shopping
        </button>
      </div>
    </div>
  );
}
