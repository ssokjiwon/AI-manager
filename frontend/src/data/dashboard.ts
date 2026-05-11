import type { PlannerData } from "@/types/dashboard";

export const dashboardData: PlannerData = {
  period: "이번 주",
  tasks: [
    {
      id: "task-1",
      title: "프로젝트 기획안 정리",
      dueDate: "2026-05-12",
      priority: "high",
      status: "doing",
    },
    {
      id: "task-2",
      title: "팀 회의 자료 준비",
      dueDate: "2026-05-13",
      priority: "medium",
      status: "todo",
    },
    {
      id: "task-3",
      title: "디자인 피드백 반영",
      dueDate: "2026-05-15",
      priority: "medium",
      status: "todo",
    },
  ],
  schedules: [
    {
      id: "schedule-1",
      title: "주간 팀 미팅",
      date: "2026-05-12",
      time: "10:00",
      location: "온라인",
    },
    {
      id: "schedule-2",
      title: "클라이언트 리뷰",
      date: "2026-05-14",
      time: "15:30",
      location: "회의실 A",
    },
  ],
};
