"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { AiChatPanel } from "@/components/AiChatPanel";
import { AiSummaryCard } from "@/components/AiSummaryCard";
import { dashboardData } from "@/data/dashboard";
import { getAiSummary } from "@/lib/api";
import type { PlannerData, ScheduleItem, TaskItem, TaskPriority } from "@/types/dashboard";

const priorityLabels: Record<TaskPriority, string> = {
  low: "낮음",
  medium: "보통",
  high: "높음",
};

export default function Home() {
  const [tasks, setTasks] = useState<TaskItem[]>(dashboardData.tasks);
  const [schedules, setSchedules] = useState<ScheduleItem[]>(dashboardData.schedules);
  const [summary, setSummary] = useState<string | null>(null);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [isSummaryLoading, setIsSummaryLoading] = useState(true);
  const [summaryError, setSummaryError] = useState<string | null>(null);

  const plannerData: PlannerData = useMemo(
    () => ({
      period: "이번 주",
      tasks,
      schedules,
    }),
    [tasks, schedules],
  );

  async function loadSummary(data = plannerData) {
    setIsSummaryLoading(true);
    setSummaryError(null);

    try {
      const response = await getAiSummary(data);
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
    loadSummary(plannerData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleAddTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const title = String(form.get("title") ?? "").trim();
    const dueDate = String(form.get("dueDate") ?? "");
    const priority = String(form.get("priority") ?? "medium") as TaskPriority;

    if (!title || !dueDate) {
      return;
    }

    setTasks((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        title,
        dueDate,
        priority,
        status: "todo",
      },
    ]);
    event.currentTarget.reset();
  }

  function handleAddSchedule(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const title = String(form.get("title") ?? "").trim();
    const date = String(form.get("date") ?? "");
    const time = String(form.get("time") ?? "");
    const location = String(form.get("location") ?? "").trim();

    if (!title || !date || !time) {
      return;
    }

    setSchedules((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        title,
        date,
        time,
        location: location || "미정",
      },
    ]);
    event.currentTarget.reset();
  }

  function toggleTaskStatus(taskId: string) {
    setTasks((current) =>
      current.map((task) =>
        task.id === taskId
          ? { ...task, status: task.status === "done" ? "todo" : "done" }
          : task,
      ),
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-5">
          <div>
            <p className="text-sm font-semibold text-blue-600">AI 일정 관리</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">
              할 일과 일정을 관리하세요
            </h1>
          </div>
          <button
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isSummaryLoading}
            onClick={() => loadSummary(plannerData)}
            type="button"
          >
            {isSummaryLoading ? "요약 중..." : "AI 요약 새로고침"}
          </button>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-6 px-5 py-6 lg:grid-cols-[1fr_360px]">
        <div className="grid gap-6">
          <section className="grid gap-4 md:grid-cols-2">
            <form
              className="rounded-2xl border border-slate-100 bg-white p-5 shadow-card"
              onSubmit={handleAddTask}
            >
              <h2 className="text-lg font-semibold text-slate-950">할 일 추가</h2>
              <div className="mt-4 grid gap-3">
                <input
                  className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  name="title"
                  placeholder="할 일을 입력하세요"
                />
                <div className="grid gap-3 sm:grid-cols-2">
                  <input
                    className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    name="dueDate"
                    type="date"
                  />
                  <select
                    className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    defaultValue="medium"
                    name="priority"
                  >
                    <option value="low">낮음</option>
                    <option value="medium">보통</option>
                    <option value="high">높음</option>
                  </select>
                </div>
                <button className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">
                  할 일 추가
                </button>
              </div>
            </form>

            <form
              className="rounded-2xl border border-slate-100 bg-white p-5 shadow-card"
              onSubmit={handleAddSchedule}
            >
              <h2 className="text-lg font-semibold text-slate-950">일정 추가</h2>
              <div className="mt-4 grid gap-3">
                <input
                  className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  name="title"
                  placeholder="일정 이름"
                />
                <div className="grid gap-3 sm:grid-cols-2">
                  <input
                    className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    name="date"
                    type="date"
                  />
                  <input
                    className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    name="time"
                    type="time"
                  />
                </div>
                <input
                  className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  name="location"
                  placeholder="장소"
                />
                <button className="rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800">
                  일정 추가
                </button>
              </div>
            </form>
          </section>

          <section className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-card">
              <h2 className="text-lg font-semibold text-slate-950">할 일 목록</h2>
              <div className="mt-4 grid gap-3">
                {tasks.map((task) => (
                  <button
                    className="flex items-center justify-between gap-4 rounded-xl border border-slate-100 bg-slate-50 p-3 text-left"
                    key={task.id}
                    onClick={() => toggleTaskStatus(task.id)}
                    type="button"
                  >
                    <span>
                      <span
                        className={`block text-sm font-semibold ${
                          task.status === "done"
                            ? "text-slate-400 line-through"
                            : "text-slate-900"
                        }`}
                      >
                        {task.title}
                      </span>
                      <span className="mt-1 block text-xs text-slate-500">
                        마감 {task.dueDate} · 우선순위 {priorityLabels[task.priority]}
                      </span>
                    </span>
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600">
                      {task.status === "done" ? "완료" : "진행"}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-card">
              <h2 className="text-lg font-semibold text-slate-950">일정 목록</h2>
              <div className="mt-4 grid gap-3">
                {schedules.map((schedule) => (
                  <div
                    className="rounded-xl border border-slate-100 bg-slate-50 p-3"
                    key={schedule.id}
                  >
                    <p className="text-sm font-semibold text-slate-900">{schedule.title}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      {schedule.date} {schedule.time} · {schedule.location}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <AiSummaryCard
            error={summaryError}
            isLoading={isSummaryLoading}
            recommendations={recommendations}
            summary={summary}
            warnings={warnings}
          />
        </div>

        <div className="lg:sticky lg:top-6 lg:self-start">
          <AiChatPanel dashboard={plannerData} />
        </div>
      </div>
    </main>
  );
}
