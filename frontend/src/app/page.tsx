"use client";

import { useEffect, useState } from "react";
import { AiChatPanel } from "@/components/AiChatPanel";
import { AiSummaryCard } from "@/components/AiSummaryCard";
import { dashboardData } from "@/data/dashboard";
import { getAiSummary } from "@/lib/api";

export default function Home() {
  const [summary, setSummary] = useState<string | null>(null);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [isSummaryLoading, setIsSummaryLoading] = useState(true);
  const [summaryError, setSummaryError] = useState<string | null>(null);

  async function loadSummary() {
    setIsSummaryLoading(true);
    setSummaryError(null);

    try {
      const response = await getAiSummary(dashboardData);
      setSummary(response.summary);
      setWarnings(response.warnings);
      setRecommendations(response.recommendations);
    } catch (caught) {
      setSummaryError(caught instanceof Error ? caught.message : "AI 요약에 실패했습니다");
    } finally {
      setIsSummaryLoading(false);
    }
  }

  useEffect(() => {
    loadSummary();
  }, []);

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-5 py-5">
          <div>
            <p className="text-sm font-semibold text-blue-600">로컬 AI 분석</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">
              AI 대시보드
            </h1>
          </div>
          <button
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isSummaryLoading}
            onClick={loadSummary}
            type="button"
          >
            {isSummaryLoading ? "요약 중..." : "요약 새로고침"}
          </button>
        </div>
      </header>

      <div className="mx-auto grid max-w-5xl gap-6 px-5 py-6 lg:grid-cols-[1fr_360px]">
        <AiSummaryCard
          error={summaryError}
          isLoading={isSummaryLoading}
          recommendations={recommendations}
          summary={summary}
          warnings={warnings}
        />
        <AiChatPanel dashboard={dashboardData} />
      </div>
    </main>
  );
}
