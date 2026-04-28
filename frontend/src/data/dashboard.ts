import type { DashboardData } from "@/types/dashboard";

export const dashboardData: DashboardData = {
  period: "이번 주",
  metrics: [
    {
      label: "총 매출",
      value: "$128.4K",
      rawValue: 128400,
      change: 12.4,
      status: "good",
    },
    {
      label: "활성 사용자",
      value: "24,892",
      rawValue: 24892,
      change: 8.1,
      status: "good",
    },
    {
      label: "위험 점수",
      value: "71",
      rawValue: 71,
      change: 18.6,
      status: "critical",
    },
    {
      label: "전환율",
      value: "6.8%",
      rawValue: 6.8,
      change: -3.2,
      status: "warning",
    },
  ],
  trend: [
    { label: "월", value: 42 },
    { label: "화", value: 48 },
    { label: "수", value: 45 },
    { label: "목", value: 58 },
    { label: "금", value: 63 },
    { label: "토", value: 70 },
    { label: "일", value: 76 },
  ],
  segments: [
    { label: "자연 유입", value: 42, color: "#2563eb" },
    { label: "유료 광고", value: 26, color: "#14b8a6" },
    { label: "추천 유입", value: 18, color: "#f59e0b" },
    { label: "직접 유입", value: 14, color: "#ef4444" },
  ],
  statuses: [
    {
      label: "데이터 파이프라인",
      value: "99.2%",
      detail: "동기화율이 안정적입니다",
      state: "Stable",
    },
    {
      label: "이상 징후 모니터",
      value: "알림 7건",
      detail: "기준선보다 높은 위험 이벤트",
      state: "Watch",
    },
    {
      label: "SLA 준수율",
      value: "96.4%",
      detail: "목표보다 1.6% 낮습니다",
      state: "Watch",
    },
  ],
  activity: [
    {
      id: "ACT-1048",
      user: "마케팅 운영",
      event: "캠페인 지출 증가",
      status: "Review",
      time: "09:42",
    },
    {
      id: "ACT-1047",
      user: "매출 봇",
      event: "매출 예측 갱신",
      status: "Success",
      time: "09:12",
    },
    {
      id: "ACT-1046",
      user: "위험 엔진",
      event: "고위험 세그먼트 감지",
      status: "Review",
      time: "08:51",
    },
    {
      id: "ACT-1045",
      user: "데이터 동기화",
      event: "CRM 가져오기 완료",
      status: "Success",
      time: "08:10",
    },
  ],
};
