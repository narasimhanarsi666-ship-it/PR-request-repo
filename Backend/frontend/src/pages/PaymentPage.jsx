import { useEffect, useRef, useState } from "react";
import { submitOrder } from "../api/paymentApi";
import { getUserId } from "../api/orderApi";
import PaymentForm from "../components/PaymentForm";
import OrderConfirmation from "../components/OrderConfirmation";

export default function PaymentPage({ checkoutPayload }) {
  const userId = getUserId();

  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");

  const inFlightRef = useRef(false);

  useEffect(() => {
    if (!checkoutPayload) {
      setError("Invalid checkout state. Please restart checkout.");
    }
  }, [checkoutPayload]);

  async function handlePay(paymentMethod) {
    if (inFlightRef.current) return;

    setError("");
    setLoading(true);
    inFlightRef.current = true;

    try {
      const payload = {
        ...checkoutPayload,
        payment_method: paymentMethod,
      };

      const result = await submitOrder(userId, payload);
      setOrder(result);
    } catch (err) {
      setError(err.message || "Payment failed");
    } finally {
      setLoading(false);
      inFlightRef.current = false;
    }
  }

  if (order) {
    return <OrderConfirmation order={order} />;
  }

  return (
    <div>
      <h2>Payment</h2>

      {error && (
        <p style={{ color: "red", marginBottom: "12px" }}>
          {error}
        </p>
      )}

      <PaymentForm onPay={handlePay} loading={loading} />

      <p style={{ marginTop: "16px", fontSize: "12px", color: "#555" }}>
        🔒 Payments are processed securely. Do not refresh during payment.
      </p>
    </div>
  );
}
