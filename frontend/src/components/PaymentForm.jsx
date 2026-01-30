import { useEffect, useState } from "react";

export default function PaymentForm({ onPay, loading }) {
  const [method, setMethod] = useState("cod");
  const [card, setCard] = useState({
    number: "",
    expiry: "",
    cvv: "",
  });
  const [upi, setUpi] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setErrors({});
  }, [method]);

  function validate() {
    const e = {};
    if (method === "card") {
      if (!/^\d{12,19}$/.test(card.number)) {
        e.number = "Invalid card number";
      }
      if (!/^\d{2}\/\d{2}$/.test(card.expiry)) {
        e.expiry = "Expiry must be MM/YY";
      }
      if (!/^\d{3,4}$/.test(card.cvv)) {
        e.cvv = "Invalid CVV";
      }
    }

    if (method === "upi") {
      if (!upi.includes("@")) {
        e.upi = "Invalid UPI ID";
      }
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    const paymentMethod =
      method === "cod"
        ? { type: "cod" }
        : method === "upi"
        ? { type: "upi", upi }
        : { type: "card", card };

    onPay(paymentMethod);
  }

  return (
    <form onSubmit={handleSubmit}>
      <h3>Payment Method</h3>

      <select
        value={method}
        onChange={(e) => setMethod(e.target.value)}
        disabled={loading}
      >
        <option value="cod">Cash on Delivery</option>
        <option value="card">Credit / Debit Card</option>
        <option value="upi">UPI</option>
      </select>

      {method === "card" && (
        <div>
          <input
            placeholder="Card Number"
            value={card.number}
            onChange={(e) =>
              setCard({ ...card, number: e.target.value })
            }
          />
          {errors.number && <small style={{ color: "red" }}>{errors.number}</small>}

          <input
            placeholder="MM/YY"
            value={card.expiry}
            onChange={(e) =>
              setCard({ ...card, expiry: e.target.value })
            }
          />
          {errors.expiry && <small style={{ color: "red" }}>{errors.expiry}</small>}

          <input
            placeholder="CVV"
            value={card.cvv}
            onChange={(e) =>
              setCard({ ...card, cvv: e.target.value })
            }
          />
          {errors.cvv && <small style={{ color: "red" }}>{errors.cvv}</small>}
        </div>
      )}

      {method === "upi" && (
        <div>
          <input
            placeholder="UPI ID"
            value={upi}
            onChange={(e) => setUpi(e.target.value)}
          />
          {errors.upi && <small style={{ color: "red" }}>{errors.upi}</small>}
        </div>
      )}

      <button disabled={loading} style={{ marginTop: "12px" }}>
        {loading ? "Processing Payment…" : "Pay Now"}
      </button>
    </form>
  );
}
