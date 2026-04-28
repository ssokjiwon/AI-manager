import type { Metric } from "@/types/dashboard";

const statusStyles = {
  good: "bg-emerald-50 text-emerald-700",
  warning: "bg-amber-50 text-amber-700",
  critical: "bg-rose-50 text-rose-700",
};

const statusLabels = {
  good: "양호",
  warning: "주의",
  critical: "위험",
};

type Props = {
  metric: Metric;
};

export function MetricCard({ metric }: Props) {
  const isPositive = metric.change >= 0;

  return (
    <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-card">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{metric.label}</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
            {metric.value}
          </p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[metric.status]}`}
        >
          {statusLabels[metric.status]}
        </span>
      </div>
      <p
        className={`mt-4 text-sm font-medium ${
          isPositive ? "text-emerald-600" : "text-rose-600"
        }`}
      >
        {isPositive ? "+" : ""}
        {metric.change}% 전주 대비
      </p>
    </section>
  );
}
