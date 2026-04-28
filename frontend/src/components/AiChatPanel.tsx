"use client";

import { FormEvent, useState } from "react";
import { askDashboardQuestion } from "@/lib/api";
import type { AiChatMessage, DashboardData } from "@/types/dashboard";

type Props = {
  dashboard: DashboardData;
};

export function AiChatPanel({ dashboard }: Props) {
  const [messages, setMessages] = useState<AiChatMessage[]>([
    {
      role: "assistant",
      content: "매출, 위험, 전환율, 최근 활동에 대해 질문해 주세요.",
    },
  ]);
  const [question, setQuestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmed = question.trim();
    if (!trimmed || isLoading) {
      return;
    }

    const nextMessages: AiChatMessage[] = [
      ...messages,
      { role: "user", content: trimmed },
    ];

    setMessages(nextMessages);
    setQuestion("");
    setError(null);
    setIsLoading(true);

    try {
      const response = await askDashboardQuestion(dashboard, trimmed, messages);
      setMessages([...nextMessages, { role: "assistant", content: response.answer }]);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "AI 채팅에 실패했습니다");
      setMessages(messages);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <aside className="rounded-2xl border border-slate-100 bg-white p-5 shadow-card">
      <div>
        <h2 className="text-lg font-semibold text-slate-950">AI 채팅 패널</h2>
        <p className="mt-1 text-sm text-slate-500">이 대시보드에 대해 질문하세요</p>
      </div>

      <div className="mt-5 flex max-h-[460px] flex-col gap-3 overflow-y-auto rounded-xl bg-slate-50 p-3">
        {messages.map((message, index) => (
          <div
            className={`max-w-[92%] rounded-xl px-3 py-2 text-sm leading-6 ${
              message.role === "user"
                ? "ml-auto bg-slate-950 text-white"
                : "bg-white text-slate-700 shadow-sm"
            }`}
            key={`${message.role}-${index}`}
          >
            {message.content}
          </div>
        ))}
      </div>

      {error ? <p className="mt-3 text-sm font-medium text-rose-600">{error}</p> : null}

      <form className="mt-4 grid gap-3" onSubmit={handleSubmit}>
        <textarea
          className="min-h-24 resize-none rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          disabled={isLoading}
          onChange={(event) => setQuestion(event.target.value)}
          placeholder="위험 점수가 왜 증가했나요?"
          value={question}
        />
        <button
          className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={isLoading || !question.trim()}
          type="submit"
        >
          {isLoading ? "질문 중..." : "AI에게 질문"}
        </button>
      </form>
    </aside>
  );
}
