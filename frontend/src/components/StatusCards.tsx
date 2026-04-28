import type { StatusItem } from "@/types/dashboard";

const stateStyles = {
  Stable: "bg-emerald-50 text-emerald-700",
  Watch: "bg-amber-50 text-amber-700",
  Critical: "bg-rose-50 text-rose-700",
};

const stateLabels = {
  Stable: "안정",
  Watch: "관찰",
  Critical: "위험",
};

type Props = {
  statuses: StatusItem[];
};

export function StatusCards({ statuses }: Props) {
  return (
    <section className="grid gap-4 lg:grid-cols-3">
      {statuses.map((status) => (
        <article
          className="rounded-2xl border border-slate-100 bg-white p-5 shadow-card"
          key={status.label}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-slate-500">{status.label}</p>
              <p className="mt-3 text-2xl font-semibold text-slate-950">{status.value}</p>
            </div>
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${stateStyles[status.state]}`}>
              {stateLabels[status.state]}
            </span>
          </div>
          <p className="mt-3 text-sm text-slate-500">{status.detail}</p>
        </article>
      ))}
    </section>
  );
}
