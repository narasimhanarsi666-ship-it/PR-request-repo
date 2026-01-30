const BASE_URL = "http://localhost:8001/api/checkout";
const DEFAULT_TIMEOUT = 10000;

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

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      const message =
        data?.detail ||
        data?.error ||
        "Payment/checkout request failed";
      throw new Error(message);
    }

    return data;
  } catch (err) {
    if (err.name === "AbortError") {
      throw new Error("Checkout request timed out. Try again.");
    }
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * CHECKOUT APIs
 */

export async function validateCheckout(userId, payload) {
  return apiRequest(`${BASE_URL}/${userId}/validate`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function submitOrder(userId, payload) {
  return apiRequest(`${BASE_URL}/${userId}/submit`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
