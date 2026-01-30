const USER_KEY = "ecom_user_id";

/**
 * Returns a stable anonymous user id.
 * Can later be replaced by real auth.
 */
export function getUserId() {
  let userId = localStorage.getItem(USER_KEY);
  if (!userId) {
    userId = `user_${crypto.randomUUID()}`;
    localStorage.setItem(USER_KEY, userId);
  }
  return userId;
}

/**
 * Utility for clearing user (testing / logout)
 */
export function clearUser() {
  localStorage.removeItem(USER_KEY);
}
