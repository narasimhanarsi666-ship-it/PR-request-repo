const BASE_URL = "http://localhost:8001/api/cart";
const DEFAULT_TIMEOUT = 8000;

/**
 * Generic fetch wrapper with timeout + error normalization
 */
async function apiRequest(url, options = {}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT);

  try {
    const res = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
    });

    let data = null;
    try {
      data = await res.json();
    } catch {
      // backend might return empty body
    }

    if (!res.ok) {
      const message =
        data?.detail ||
        data?.error ||
        `Request failed with status ${res.status}`;
      throw new Error(message);
    }

    return data;
  } catch (err) {
    if (err.name === "AbortError") {
      throw new Error("Request timed out. Please try again.");
    }
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * CART APIs
 */

export async function fetchCart(userId, couponCode = "") {
  const qs = couponCode ? `?coupon_code=${encodeURIComponent(couponCode)}` : "";
  return apiRequest(`${BASE_URL}/${userId}${qs}`);
}

export async function addToCart({ user_id, sku, name, price, qty }) {
  return apiRequest(`${BASE_URL}/${user_id}/add`, {
    method: "POST",
    body: JSON.stringify({ user_id, sku, name, price, qty }),
  });
}

export async function updateCartQuantity({ user_id, sku, qty }) {
  return apiRequest(`${BASE_URL}/${user_id}/update`, {
    method: "POST",
    body: JSON.stringify({ user_id, sku, qty }),
  });
}

export async function removeCartItem({ user_id, sku }) {
  return apiRequest(`${BASE_URL}/${user_id}/remove`, {
    method: "POST",
    body: JSON.stringify({ user_id, sku }),
  });
}
