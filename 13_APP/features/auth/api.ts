import { prisma } from "@/lib/prisma";

export async function requireAdminFromRequest(req: Request) {
  const cookie = req.headers.get("cookie") || "";
  const tokenMatch = cookie.match(/crm_session=([^;]+)/);
  const token = tokenMatch?.[1];
  if (!token) return null;
  const session = await prisma.session.findUnique({ where: { token }, include: { user: true } });
  if (!session || session.expiresAt < new Date() || !session.user.isActive) return null;
  if (session.user.role !== "admin") return null;
  return session.user;
}
