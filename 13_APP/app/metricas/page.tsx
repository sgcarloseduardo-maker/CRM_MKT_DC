import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function MetricasPage() {
  const snapshots = await prisma.metricSnapshot.findMany({ orderBy: { snapshotAt: "desc" }, take: 200, include: { channel: true } });
  const byChannel = new Map<string, { cliques: number; ctr: number; count: number }>();

  snapshots.forEach((s) => {
    const key = s.channel.name;
    const current = byChannel.get(key) || { cliques: 0, ctr: 0, count: 0 };
    if (s.metricType.toLowerCase().includes("click")) current.cliques += s.metricValue;
    if (s.metricType.toLowerCase().includes("ctr")) current.ctr += s.metricValue;
    current.count += 1;
    byChannel.set(key, current);
  });

  return (
    <section>
      <h1>Métricas</h1>
      <p className="muted">Leitura de desempenho por canal, produto, criativo, CTA e formato.</p>

      <div className="card" style={{ marginTop: 16 }}>
        <h3 style={{ marginTop: 0 }}>Resumo por canal</h3>
        {byChannel.size === 0 ? (
          <p className="muted">Sem dados métricos suficientes no ambiente atual.</p>
        ) : (
          <ul>
            {Array.from(byChannel.entries()).map(([channel, data]) => (
              <li key={channel}>
                {channel}: cliques={data.cliques.toFixed(2)} | ctr_medio={(data.ctr / Math.max(data.count, 1)).toFixed(2)}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        <h3 style={{ marginTop: 0 }}>Indicadores estruturais</h3>
        <ul>
          <li>Desempenho por canal: disponível</li>
          <li>Desempenho por produto: base pronta para leitura</li>
          <li>Desempenho por criativo/CTA: depende de snapshots por tipo</li>
          <li>Comparação de formatos: base pronta</li>
          <li>Leitura comercial: depende de volume maior de dados reais</li>
        </ul>
      </div>
    </section>
  );
}
