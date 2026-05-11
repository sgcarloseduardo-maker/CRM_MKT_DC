import { prisma } from "@/lib/prisma";
import { SocialOperationalPanel } from "./social-operational-panel";

export const dynamic = "force-dynamic";

const socialMap = ["blog", "youtube", "instagram", "tiktok", "mercado-livre", "shopee", "facebook", "kwai"] as const;

export default async function CanaisPage({ searchParams }: { searchParams?: { tab?: string; subtab?: string } }) {
  const [master, products, channelContents] = await Promise.all([
    prisma.contentMaster.findFirst({ orderBy: { createdAt: "desc" } }),
    prisma.affiliateProduct.findMany({ orderBy: { createdAt: "desc" }, take: 8 }),
    prisma.channelContent.findMany({ orderBy: { createdAt: "desc" }, take: 40 })
  ]);

  const initialTab = socialMap.includes((searchParams?.tab || "") as (typeof socialMap)[number])
    ? (searchParams?.tab as (typeof socialMap)[number])
    : "blog";

  return (
    <SocialOperationalPanel master={master} products={products} channelContents={channelContents} initialTab={initialTab} />
  );
}
