export type Metric = {
  label: string;
  value: string;
  rawValue: number;
  change: number;
  status: "good" | "warning" | "critical";
};

export type TrendPoint = {
  label: string;
  value: number;
};

export type Segment = {
  label: string;
  value: number;
  color: string;
};

export type StatusItem = {
  label: string;
  value: string;
  detail: string;
  state: "Stable" | "Watch" | "Critical";
};

export type Activity = {
  id: string;
  user: string;
  event: string;
  status: "Success" | "Review" | "Failed";
  time: string;
};

export type DashboardData = {
  period: string;
  metrics: Metric[];
  trend: TrendPoint[];
  segments: Segment[];
  statuses: StatusItem[];
  activity: Activity[];
};

export type AiSummaryResponse = {
  summary: string;
  warnings: string[];
  recommendations: string[];
};

export type AiInsightsResponse = {
  insights: string[];
};

export type AiChatMessage = {
  role: "user" | "assistant";
  content: string;
};
