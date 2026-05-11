type Props = { status: string };

const colorByStatus: Record<string, string> = {
  draft: "#64748b",
  em_producao: "#2563eb",
  em_revisao: "#d97706",
  aprovado: "#059669",
  publicado: "#0f9d58",
  arquivado: "#6b7280",
  in_production: "#2563eb",
  review: "#d97706",
  approved: "#059669",
  pending: "#64748b"
};

export function StatusBadge({ status }: Props) {
  const color = colorByStatus[status] || "#64748b";
  return (
    <span
      className="badge"
      style={{ borderColor: color, color, fontWeight: 600 }}
    >
      {status}
    </span>
  );
}
