export type TaskStatus = "todo" | "doing" | "done";
export type TaskPriority = "low" | "medium" | "high";

export type TaskItem = {
  id: string;
  title: string;
  dueDate: string;
  priority: TaskPriority;
  status: TaskStatus;
};

export type ScheduleItem = {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
};

export type PlannerData = {
  period: string;
  tasks: TaskItem[];
  schedules: ScheduleItem[];
};

export type DashboardData = PlannerData;

export type AiSummaryResponse = {
  summary: string;
  warnings: string[];
  recommendations: string[];
};

export type AiChatMessage = {
  role: "user" | "assistant";
  content: string;
};
