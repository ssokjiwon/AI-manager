import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI 일정 관리 앱",
  description: "FastAPI와 Ollama로 구동되는 로컬 일정 관리 앱",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
