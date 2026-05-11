type Bar = { label: string; value: number };

export function BarChart({ bars }: { bars: Bar[] }) {
  if (bars.length === 0) return <p className="muted">Sem dados para gráfico.</p>;
  const max = Math.max(...bars.map((b) => b.value), 1);

  return (
    <div style={{ display: "grid", gap: 8 }}>
      {bars.map((bar) => (
        <div key={bar.label}>
          <div className="muted">{bar.label}: {bar.value.toFixed(2)}</div>
          <div style={{ height: 14, background: "#e5edf6", borderRadius: 8 }}>
            <div style={{ width: `${(bar.value / max) * 100}%`, height: "100%", background: "#0f4c81", borderRadius: 8 }} />
          </div>
        </div>
      ))}
    </div>
  );
}
