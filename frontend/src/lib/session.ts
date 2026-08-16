import { cookies } from "next/headers";

const SESSION_COOKIE = "hisobim_token";

export async function getToken(): Promise<string | undefined> {
  const store = await cookies();
  return store.get(SESSION_COOKIE)?.value;
}

export async function setToken(token: string) {
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days, matches backend JWT_EXPIRES_IN
  });
}

export async function clearToken() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}
