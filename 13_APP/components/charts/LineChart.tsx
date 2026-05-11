type Point = { label: string; value: number };

export function LineChart({ points, width = 640, height = 220 }: { points: Point[]; width?: number; height?: number }) {
  if (points.length === 0) return <p className="muted">Sem dados para gráfico.</p>;
  const max = Math.max(...points.map((p) => p.value), 1);
  const min = Math.min(...points.map((p) => p.value), 0);
  const span = Math.max(max - min, 1);
  const stepX = width / Math.max(points.length - 1, 1);
  const toY = (v: number) => height - ((v - min) / span) * (height - 20) - 10;
  const d = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${i * stepX} ${toY(p.value)}`)
    .join(" ");

  return (
    <svg viewBox={`0 0 ${width} ${height}`} style={{ width: "100%", height: "220px", background: "#fff" }}>
      <path d={d} stroke="#0f4c81" strokeWidth="2" fill="none" />
      {points.map((p, i) => (
        <circle key={`${p.label}-${i}`} cx={i * stepX} cy={toY(p.value)} r={3} fill="#f29f05" />
      ))}
    </svg>
  );
}
