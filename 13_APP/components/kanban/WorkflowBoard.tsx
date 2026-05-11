import { StatusBadge } from "@/components/status/StatusBadge";

type Item = { id: string; title: string; status: string; subtitle?: string };

const columns = ["draft", "em_producao", "em_revisao", "aprovado", "publicado", "arquivado"];

function normalizeStatus(status: string) {
  if (status === "in_production") return "em_producao";
  if (status === "review") return "em_revisao";
  if (status === "approved") return "aprovado";
  if (status === "published") return "publicado";
  return status;
}

export function WorkflowBoard({ items, title }: { items: Item[]; title: string }) {
  return (
    <div className="card">
      <h3 style={{ marginTop: 0 }}>{title}</h3>
      <div style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(6, minmax(150px, 1fr))", overflowX: "auto" }}>
        {columns.map((col) => {
          const colItems = items.filter((i) => normalizeStatus(i.status) === col);
          return (
            <div key={col} style={{ border: "1px solid var(--border)", borderRadius: 10, padding: 8 }}>
              <div style={{ marginBottom: 8 }}><StatusBadge status={col} /></div>
              {colItems.length === 0 ? (
                <p className="muted" style={{ fontSize: 12 }}>Vazio</p>
              ) : (
                <div style={{ display: "grid", gap: 8 }}>
                  {colItems.map((item) => (
                    <div key={item.id} style={{ border: "1px solid var(--border)", borderRadius: 8, padding: 8 }}>
                      <strong style={{ fontSize: 13 }}>{item.title}</strong>
                      {item.subtitle ? <div className="muted" style={{ fontSize: 12 }}>{item.subtitle}</div> : null}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
