import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function CampanhasPage({
  searchParams
}: {
  searchParams: { from?: string; to?: string; channelId?: string; status?: string; page?: string; limit?: string; sort?: string };
}) {
  const page = Math.max(Number(searchParams.page || "1"), 1);
  const limit = Math.max(Number(searchParams.limit || "10"), 1);
  const skip = (page - 1) * limit;
  const orderBy = searchParams.sort === "name" ? { name: "asc" as const } : { createdAt: "desc" as const };

  const channels = await prisma.channel.findMany({ orderBy: { name: "asc" } });
  const where: Record<string, unknown> = {};
  if (searchParams.channelId) where.channelId = searchParams.channelId;
  if (searchParams.status) where.status = searchParams.status;
  if (searchParams.from || searchParams.to) {
    where.createdAt = {
      ...(searchParams.from ? { gte: new Date(searchParams.from) } : {}),
      ...(searchParams.to ? { lte: new Date(searchParams.to) } : {})
    };
  }

  const [campaigns, total] = await Promise.all([
    prisma.campaign.findMany({
      where,
      include: { channel: true, affiliateProduct: true },
      orderBy,
      skip,
      take: limit
    }),
    prisma.campaign.count({ where })
  ]);
  const totalPages = Math.max(Math.ceil(total / limit), 1);
  const makeQuery = (updates: Record<string, string>) => {
    const qs = new URLSearchParams(searchParams as Record<string, string>);
    for (const [k, v] of Object.entries(updates)) qs.set(k, v);
    return `?${qs.toString()}`;
  };

  return (
    <section>
      <h1>Campanhas</h1>
      <form className="card" style={{ display: "grid", gap: 8, marginBottom: 16 }}>
        <h3 style={{ margin: 0 }}>Filtros</h3>
        <div className="grid">
          <input type="date" name="from" defaultValue={searchParams.from || ""} />
          <input type="date" name="to" defaultValue={searchParams.to || ""} />
          <select name="channelId" defaultValue={searchParams.channelId || ""}>
            <option value="">Todos canais</option>
            {channels.map((channel) => <option key={channel.id} value={channel.id}>{channel.name}</option>)}
          </select>
          <select name="status" defaultValue={searchParams.status || ""}>
            <option value="">Todos status</option>
            <option value="planning">planning</option>
            <option value="active">active</option>
            <option value="paused">paused</option>
            <option value="closed">closed</option>
          </select>
          <select name="sort" defaultValue={searchParams.sort || "createdAt"}>
            <option value="createdAt">Mais recentes</option>
            <option value="name">Nome</option>
          </select>
          <button type="submit">Aplicar filtros</button>
        </div>
      </form>
      <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
        <a href={`/api/export/campanhas?${new URLSearchParams(searchParams as Record<string, string>).toString()}&format=csv&mode=summary`}>CSV resumo</a>
        <a href={`/api/export/campanhas?${new URLSearchParams(searchParams as Record<string, string>).toString()}&format=json&mode=detailed`}>JSON detalhado</a>
        <a href={`/api/export/campanhas?${new URLSearchParams(searchParams as Record<string, string>).toString()}&bundle=zip&mode=detailed`}>ZIP</a>
      </div>
      <div className="card">
        {campaigns.length === 0 ? (
          <p className="muted">Nenhuma campanha cadastrada.</p>
        ) : (
          <ul>
            {campaigns.map((campaign) => (
              <li key={campaign.id}>
                <Link href={`/campanhas/${campaign.id}`}>{campaign.name}</Link>
                {" "}- {campaign.channel.name}
                {campaign.affiliateProduct ? ` - ${campaign.affiliateProduct.name}` : ""}
              </li>
            ))}
          </ul>
        )}
        <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
          {page > 1 && <a href={makeQuery({ page: String(page - 1), limit: String(limit) })}>Anterior</a>}
          <span>Página {page} de {totalPages}</span>
          {page < totalPages && <a href={makeQuery({ page: String(page + 1), limit: String(limit) })}>Próxima</a>}
        </div>
      </div>
    </section>
  );
}
