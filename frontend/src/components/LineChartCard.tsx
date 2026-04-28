import type { TrendPoint } from "@/types/dashboard";

type Props = {
  data: TrendPoint[];
};

export function LineChartCard({ data }: Props) {
  const width = 640;
  const height = 260;
  const padding = 28;
  const values = data.map((point) => point.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  const points = data.map((point, index) => {
    const x = padding + (index / (data.length - 1)) * (width - padding * 2);
    const y =
      height - padding - ((point.value - min) / range) * (height - padding * 2);
    return { ...point, x, y };
  });

  const path = points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");

  const areaPath = `${path} L ${width - padding} ${height - padding} L ${padding} ${
    height - padding
  } Z`;

  return (
    <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-card">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-950">활동 추이</h2>
          <p className="mt-1 text-sm text-slate-500">주간 활동량</p>
        </div>
        <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">
          +12.4%
        </span>
      </div>
      <svg
        className="mt-6 h-64 w-full"
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label="주간 활동량 라인 차트"
      >
        <defs>
          <linearGradient id="lineArea" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#2563eb" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0, 1, 2, 3].map((tick) => {
          const y = padding + tick * ((height - padding * 2) / 3);
          return (
            <line
              key={tick}
              x1={padding}
              x2={width - padding}
              y1={y}
              y2={y}
              stroke="#e5e7eb"
            />
          );
        })}
        <path d={areaPath} fill="url(#lineArea)" />
        <path d={path} fill="none" stroke="#2563eb" strokeLinecap="round" strokeWidth="4" />
        {points.map((point) => (
          <g key={point.label}>
            <circle cx={point.x} cy={point.y} fill="#ffffff" r="6" stroke="#2563eb" strokeWidth="3" />
            <text
              fill="#64748b"
              fontSize="12"
              textAnchor="middle"
              x={point.x}
              y={height - 8}
            >
              {point.label}
            </text>
          </g>
        ))}
      </svg>
    </section>
  );
}
