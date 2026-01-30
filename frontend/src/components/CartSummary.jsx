function formatCurrency(value) {
  if (typeof value !== "number") return "—";
  return `₹${value.toFixed(2)}`;
}

export default function CartSummary({ totals }) {
  if (!totals) return null;

  const {
    subtotal,
    discount,
    tax,
    shipping,
    total,
    coupon_applied,
  } = totals;

  return (
    <div
      style={{
        marginTop: "24px",
        padding: "16px",
        border: "1px solid #ddd",
        maxWidth: "360px",
      }}
    >
      <h3>Order Summary</h3>

      <div>
        <span>Subtotal</span>
        <span style={{ float: "right" }}>
          {formatCurrency(subtotal)}
        </span>
      </div>

      {discount > 0 && (
        <div style={{ color: "green" }}>
          <span>
            Discount {coupon_applied ? `(${coupon_applied})` : ""}
          </span>
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
        <span>Total</span>
        <span style={{ float: "right" }}>
          {formatCurrency(total)}
        </span>
      </div>

      {discount > 0 && (
        <p style={{ marginTop: "8px", color: "green" }}>
          You saved {formatCurrency(discount)} 🎉
        </p>
      )}
    </div>
  );
}
