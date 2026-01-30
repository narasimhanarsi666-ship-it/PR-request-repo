import { useEffect, useState } from "react";
import { validateCheckout } from "../api/paymentApi";
import { getUserId } from "../api/orderApi";

const STORAGE_KEY = "checkout_form_state";

export default function CheckoutPage({ onPayment }) {
  const userId = getUserId();

  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    pin: "",
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  /* -----------------------------
     Restore persisted form state
  ------------------------------ */
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setForm(JSON.parse(saved));
    }
  }, []);

  /* -----------------------------
     Persist form on change
  ------------------------------ */
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
  }, [form]);

  /* -----------------------------
     Validation helpers
  ------------------------------ */
  function validateField(name, value) {
    switch (name) {
      case "name":
        return value.trim().length < 2 ? "Name is required" : "";
      case "email":
        return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
          ? "Invalid email"
          : "";
      case "address":
        return value.trim().length < 5 ? "Address too short" : "";
      case "city":
        return value.trim().length < 2 ? "City is required" : "";
      case "pin":
        return !/^\d{6}$/.test(value)
          ? "PIN must be 6 digits"
          : "";
      default:
        return "";
    }
  }

  function validateForm() {
    const newErrors = {};
    Object.entries(form).forEach(([key, value]) => {
      const err = validateField(key, value);
      if (err) newErrors[key] = err;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  /* -----------------------------
     Input handlers
  ------------------------------ */
  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setServerError("");
  }

  /* -----------------------------
     Submit & validate checkout
  ------------------------------ */
  async function handleSubmit(e) {
    e.preventDefault();
    setServerError("");

    if (!validateForm()) return;

    setLoading(true);

    try {
      const payload = {
        shipping: form,
        payment_method: { type: "cod" }, // actual method selected in Payment step
      };

      const res = await validateCheckout(userId, payload);

      if (!res.ok) {
        setServerError(res.errors?.join(", ") || "Validation failed");
        return;
      }

      // success → move to payment
      onPayment(payload);
    } catch (err) {
      setServerError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Checkout</h2>

      {serverError && (
        <p style={{ color: "red", marginBottom: "12px" }}>
          {serverError}
        </p>
      )}

      <div>
        <label>Name</label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          onBlur={(e) =>
            setErrors((p) => ({
              ...p,
              name: validateField("name", e.target.value),
            }))
          }
        />
        {errors.name && <small style={{ color: "red" }}>{errors.name}</small>}
      </div>

      <div>
        <label>Email</label>
        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          onBlur={(e) =>
            setErrors((p) => ({
              ...p,
              email: validateField("email", e.target.value),
            }))
          }
        />
        {errors.email && (
          <small style={{ color: "red" }}>{errors.email}</small>
        )}
      </div>

      <div>
        <label>Address</label>
        <textarea
          name="address"
          value={form.address}
          onChange={handleChange}
          onBlur={(e) =>
            setErrors((p) => ({
              ...p,
              address: validateField("address", e.target.value),
            }))
          }
        />
        {errors.address && (
          <small style={{ color: "red" }}>{errors.address}</small>
        )}
      </div>

      <div>
        <label>City</label>
        <input
          name="city"
          value={form.city}
          onChange={handleChange}
          onBlur={(e) =>
            setErrors((p) => ({
              ...p,
              city: validateField("city", e.target.value),
            }))
          }
        />
        {errors.city && <small style={{ color: "red" }}>{errors.city}</small>}
      </div>

      <div>
        <label>PIN</label>
        <input
          name="pin"
          value={form.pin}
          onChange={handleChange}
          onBlur={(e) =>
            setErrors((p) => ({
              ...p,
              pin: validateField("pin", e.target.value),
            }))
          }
        />
        {errors.pin && <small style={{ color: "red" }}>{errors.pin}</small>}
      </div>

      <button disabled={loading} style={{ marginTop: "16px" }}>
        {loading ? "Validating..." : "Continue to Payment"}
      </button>
    </form>
  );
}
