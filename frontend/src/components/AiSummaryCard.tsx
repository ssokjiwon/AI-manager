type Props = {
  summary: string | null;
  warnings: string[];
  recommendations: string[];
  isLoading: boolean;
  error: string | null;
};

export function AiSummaryCard({
  summary,
  warnings,
  recommendations,
  isLoading,
  error,
}: Props) {
  return (
    <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-card">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-950">AI 업무 요약</h2>
          <p className="mt-1 text-sm text-slate-500">
            현재 할 일과 일정을 바탕으로 오늘의 흐름을 정리합니다
          </p>
        </div>
        <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
          Ollama
        </span>
      </div>

      <p className="mt-5 min-h-24 rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-700">
        {isLoading ? "AI가 할 일과 일정을 분석하는 중입니다..." : summary}
        {!isLoading && !summary ? "요약 결과가 여기에 표시됩니다." : null}
      </p>

      {error ? <p className="mt-3 text-sm font-medium text-rose-600">{error}</p> : null}

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <div>
          <h3 className="text-sm font-semibold text-slate-950">주의할 점</h3>
          <div className="mt-3 grid gap-2">
            {warnings.length > 0 ? (
              warnings.map((warning) => (
                <div
                  className="rounded-xl border border-amber-100 bg-amber-50 p-3 text-sm text-amber-800"
                  key={warning}
                >
                  {warning}
                </div>
              ))
            ) : (
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 text-sm text-slate-500">
                아직 주의 항목이 없습니다.
              </div>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-slate-950">추천 행동</h3>
          <div className="mt-3 grid gap-2">
            {recommendations.length > 0 ? (
              recommendations.map((recommendation) => (
                <div
                  className="rounded-xl border border-blue-100 bg-blue-50 p-3 text-sm text-blue-800"
                  key={recommendation}
                >
                  {recommendation}
                </div>
              ))
            ) : (
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 text-sm text-slate-500">
                추천 행동이 여기에 표시됩니다.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
