import type { Segment } from "@/types/dashboard";

type Props = {
  data: Segment[];
};

export function DonutChartCard({ data }: Props) {
  const total = data.reduce((sum, segment) => sum + segment.value, 0);
  let offset = 25;

  return (
    <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-card">
      <h2 className="text-lg font-semibold text-slate-950">트래픽 구성</h2>
      <p className="mt-1 text-sm text-slate-500">채널별 기여도</p>
      <div className="relative mt-6 grid place-items-center">
        <svg className="h-52 w-52 -rotate-90" viewBox="0 0 120 120" role="img" aria-label="트래픽 구성 도넛 차트">
          {data.map((segment) => {
            const length = (segment.value / total) * 100;
            const strokeDasharray = `${length} ${100 - length}`;
            const strokeDashoffset = offset;
            offset -= length;

            return (
              <circle
                key={segment.label}
                cx="60"
                cy="60"
                fill="none"
                r="42"
                stroke={segment.color}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                strokeWidth="16"
              />
            );
          })}
        </svg>
        <div className="absolute text-center">
          <p className="text-3xl font-semibold text-slate-950">100%</p>
          <p className="text-sm text-slate-500">트래픽</p>
        </div>
      </div>
      <div className="mt-6 grid gap-3">
        {data.map((segment) => (
          <div className="flex items-center justify-between text-sm" key={segment.label}>
            <span className="flex items-center gap-2 text-slate-600">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: segment.color }}
              />
              {segment.label}
            </span>
            <span className="font-semibold text-slate-900">{segment.value}%</span>
          </div>
        ))}
      </div>
    </section>
  );
}
