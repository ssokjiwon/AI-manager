type Props = {
  insights: string[];
  isLoading: boolean;
  error: string | null;
  onGenerate: () => void;
};

export function AiInsightPanel({ insights, isLoading, error, onGenerate }: Props) {
  return (
    <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-card">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-950">AI 인사이트 생성기</h2>
          <p className="mt-1 text-sm text-slate-500">목업 데이터에서 핵심 인사이트를 생성합니다</p>
        </div>
        <button
          className="rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={isLoading}
          onClick={onGenerate}
          type="button"
        >
          {isLoading ? "생성 중..." : "인사이트 생성"}
        </button>
      </div>

      {error ? <p className="mt-4 text-sm font-medium text-rose-600">{error}</p> : null}

      <div className="mt-5 grid gap-3">
        {insights.length > 0 ? (
          insights.map((insight, index) => (
            <article
              className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm leading-6 text-slate-700"
              key={insight}
            >
              <span className="mr-2 font-semibold text-slate-950">#{index + 1}</span>
              {insight}
            </article>
          ))
        ) : (
          <div className="rounded-xl border border-dashed border-slate-200 p-5 text-sm text-slate-500">
              인사이트 생성을 눌러 Ollama에 3-5개의 유용한 관찰을 요청하세요.
          </div>
        )}
      </div>
    </section>
  );
}
