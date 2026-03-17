import { CONSTANTS } from "@/utils/constants";
import { cookies } from "next/headers";

/**
 * Set the auth token as an HTTP-only secure cookie.
 * Call this from Server Actions after a successful login.
 */
export async function setAuthCookie(
  token: string,
  maxAgeSeconds: number,
): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(CONSTANTS.AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: maxAgeSeconds,
  });
}

/**
 * Remove the auth cookie. Call this on logout or when the token is expired.
 */
export async function clearAuthCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(CONSTANTS.AUTH_COOKIE_NAME);
}

/**
 * Read the auth token from the cookie.
 * Returns the token string or null if not present.
 */
export async function getAuthToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(CONSTANTS.AUTH_COOKIE_NAME)?.value ?? null;
}

/**
 * Build headers for authenticated requests to the Fastify backend.
 * Usage in Server Components or Server Actions:
 *
 *   const response = await fetch(`${API_BASE_URL}/some-endpoint`, {
 *     headers: await getAuthHeaders(),
 *   });
 */
export async function getAuthHeaders(): Promise<HeadersInit> {
  const token = await getAuthToken();

  if (!token) {
    throw new Error("No auth token found — user is not authenticated");
  }

  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}
