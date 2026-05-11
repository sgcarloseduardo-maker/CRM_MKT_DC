"use server";

import { randomBytes } from "crypto";
import { compare } from "bcryptjs";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { clearSessionCookie, getSessionToken, setSessionToken } from "@/features/auth/session";

export async function loginAction(formData: FormData) {
  const username = String(formData.get("username") || "").trim();
  const password = String(formData.get("password") || "").trim();
  if (!username || !password) redirect("/login?error=credenciais");

  const user = await prisma.user.findUnique({ where: { username } });
  if (!user || !user.isActive) redirect("/login?error=credenciais");

  const ok = await compare(password, user.passwordHash);
  if (!ok) redirect("/login?error=credenciais");

  const token = randomBytes(32).toString("hex");
  await prisma.session.create({
    data: {
      token,
      userId: user.id,
      expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000)
    }
  });

  await setSessionToken(token);
  redirect("/");
}

export async function logoutAction() {
  const token = await getSessionToken();
  if (token) {
    await prisma.session.deleteMany({ where: { token } });
  }
  await clearSessionCookie();
  redirect("/login");
}
