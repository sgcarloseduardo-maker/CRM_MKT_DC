import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export const COOKIE_NAME = "crm_session";

export async function setSessionToken(token: string) {
  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8
  });
}

export async function clearSessionCookie() {
  cookies().delete(COOKIE_NAME);
}

export async function getSessionToken() {
  return cookies().get(COOKIE_NAME)?.value || null;
}

export async function getSessionUser() {
  const token = await getSessionToken();
  if (!token) return null;
  const session = await prisma.session.findUnique({
    where: { token },
    include: { user: true }
  });
  if (!session) return null;
  if (session.expiresAt < new Date() || !session.user.isActive) return null;
  return session.user;
}
