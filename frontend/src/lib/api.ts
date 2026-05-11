import type {
  AiChatMessage,
  AiSummaryResponse,
  DashboardData,
} from "@/types/dashboard";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

export async function getAiSummary(
  dashboard: DashboardData,
): Promise<AiSummaryResponse> {
  return postJson<AiSummaryResponse>("/ai/summary", { dashboard });
}

export async function askDashboardQuestion(
  dashboard: DashboardData,
  question: string,
  messages: AiChatMessage[],
): Promise<{ answer: string }> {
  return postJson<{ answer: string }>("/ai/chat", {
    dashboard,
    question,
    messages,
  });
}

async function postJson<TResponse>(
  path: string,
  body: unknown,
): Promise<TResponse> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const detail = await readErrorDetail(response);
    throw new Error(detail ?? `요청 실패: HTTP ${response.status}`);
  }

  return response.json() as Promise<TResponse>;
}

async function readErrorDetail(response: Response): Promise<string | null> {
  try {
    const data = (await response.json()) as { detail?: unknown };
    return typeof data.detail === "string" ? data.detail : null;
  } catch {
    return null;
  }
}
