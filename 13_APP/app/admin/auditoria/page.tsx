import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AuditPage({
  searchParams
}: {
  searchParams: { page?: string; limit?: string; entityType?: string; action?: string; actor?: string; from?: string; to?: string };
}) {
  const page = Math.max(Number(searchParams.page || "1"), 1);
  const limit = Math.max(Number(searchParams.limit || "20"), 1);
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {};
  if (searchParams.entityType) where.entityType = searchParams.entityType;
  if (searchParams.action) where.action = searchParams.action;
  if (searchParams.actor) where.actor = searchParams.actor;
  if (searchParams.from || searchParams.to) {
    where.createdAt = {
      ...(searchParams.from ? { gte: new Date(searchParams.from) } : {}),
      ...(searchParams.to ? { lte: new Date(searchParams.to) } : {})
    };
  }

  const [total, logs] = await Promise.all([
    prisma.auditLog.count({ where }),
    prisma.auditLog.findMany({ where, orderBy: { createdAt: "desc" }, skip, take: limit, include: { actorUser: true } })
  ]);

  const totalPages = Math.max(Math.ceil(total / limit), 1);
  const qs = new URLSearchParams(searchParams as Record<string, string>);

  return (
    <section>
      <h1>Auditoria</h1>
      <form className="card" style={{ display: "grid", gap: 8 }}>
        <h3 style={{ margin: 0 }}>Filtros</h3>
        <div className="grid">
          <input type="date" name="from" defaultValue={searchParams.from || ""} />
          <input type="date" name="to" defaultValue={searchParams.to || ""} />
          <input name="entityType" placeholder="EntityType" defaultValue={searchParams.entityType || ""} />
          <input name="action" placeholder="Action" defaultValue={searchParams.action || ""} />
          <input name="actor" placeholder="Actor" defaultValue={searchParams.actor || ""} />
          <input name="limit" type="number" min={5} defaultValue={String(limit)} />
          <button type="submit">Aplicar filtros</button>
        </div>
      </form>

      <div className="card" style={{ marginTop: 16 }}>
        <p>Total de eventos: {total}</p>
        <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
          <a href={`/api/export/auditoria?${qs.toString()}&format=csv&mode=summary`}>CSV resumo</a>
          <a href={`/api/export/auditoria?${qs.toString()}&format=json&mode=detailed`}>JSON detalhado</a>
          <a href={`/api/export/auditoria?${qs.toString()}&bundle=zip&mode=detailed`}>ZIP</a>
        </div>
        <ul>
          {logs.map((log) => (
            <li key={log.id} style={{ marginBottom: 8 }}>
              <strong>[{log.createdAt.toLocaleString("pt-BR")}] {log.action.toUpperCase()}</strong> {log.entityType} ({log.entityId}) por {log.actor}
              <div className="muted">Usuário: {log.actorUser?.username || "fallback"}</div>
              <div className="muted">{log.summary || "sem resumo"}</div>
              {log.diffJson ? <pre style={{ whiteSpace: "pre-wrap" }}>{log.diffJson}</pre> : null}
            </li>
          ))}
        </ul>
        <div style={{ display: "flex", gap: 10 }}>
          {page > 1 && <Link href={`/admin/auditoria?${new URLSearchParams({ ...searchParams, page: String(page - 1) } as Record<string, string>).toString()}`}>Anterior</Link>}
          <span>Página {page} de {totalPages}</span>
          {page < totalPages && <Link href={`/admin/auditoria?${new URLSearchParams({ ...searchParams, page: String(page + 1) } as Record<string, string>).toString()}`}>Próxima</Link>}
        </div>
      </div>
    </section>
  );
}
