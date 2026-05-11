type Props = {
  title: string;
  value: string;
  note: string;
};

export function KpiCard({ title, value, note }: Props) {
  return (
    <div className="card">
      <div className="muted">{title}</div>
      <div className="kpi">{value}</div>
      <div className="muted">{note}</div>
    </div>
  );
}
