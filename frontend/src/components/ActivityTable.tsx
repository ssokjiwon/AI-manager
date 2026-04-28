import type { Activity } from "@/types/dashboard";

const statusStyles = {
  Success: "bg-emerald-50 text-emerald-700",
  Review: "bg-amber-50 text-amber-700",
  Failed: "bg-rose-50 text-rose-700",
};

const statusLabels = {
  Success: "성공",
  Review: "검토",
  Failed: "실패",
};

type Props = {
  activity: Activity[];
};

export function ActivityTable({ activity }: Props) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-card">
      <div className="border-b border-slate-100 p-6">
        <h2 className="text-lg font-semibold text-slate-950">최근 활동</h2>
        <p className="mt-1 text-sm text-slate-500">최신 운영 이벤트</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-6 py-3 font-semibold">ID</th>
              <th className="px-6 py-3 font-semibold">담당</th>
              <th className="px-6 py-3 font-semibold">이벤트</th>
              <th className="px-6 py-3 font-semibold">상태</th>
              <th className="px-6 py-3 font-semibold">시간</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {activity.map((item) => (
              <tr className="text-slate-700" key={item.id}>
                <td className="px-6 py-4 font-medium text-slate-950">{item.id}</td>
                <td className="px-6 py-4">{item.user}</td>
                <td className="px-6 py-4">{item.event}</td>
                <td className="px-6 py-4">
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[item.status]}`}>
                    {statusLabels[item.status]}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-500">{item.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
