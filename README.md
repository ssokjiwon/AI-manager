# AI 분석 대시보드

AI 어시스턴트 기능을 포함한 로컬 분석 대시보드입니다.

- 프론트엔드: Next.js, TypeScript, Tailwind CSS
- 백엔드: FastAPI
- LLM 제공자: `http://localhost:11434`에서 실행되는 Ollama
- 모델: `qwen3.5:9b`
- API 방식: Next.js, FastAPI, Ollama 사이의 REST 통신

## 파일 구조

```text
.
|-- backend
|   |-- .env.example
|   |-- app
|   |   |-- __init__.py
|   |   |-- config.py
|   |   |-- main.py
|   |   |-- ollama.py
|   |   `-- schemas.py
|   `-- requirements.txt
|-- frontend
|   |-- .env.local.example
|   |-- eslint.config.mjs
|   |-- next-env.d.ts
|   |-- next.config.ts
|   |-- package.json
|   |-- postcss.config.mjs
|   |-- tailwind.config.ts
|   |-- src
|   |   |-- app
|   |   |   |-- globals.css
|   |   |   |-- layout.tsx
|   |   |   `-- page.tsx
|   |   |-- components
|   |   |   |-- ActivityTable.tsx
|   |   |   |-- AiChatPanel.tsx
|   |   |   |-- AiInsightPanel.tsx
|   |   |   |-- AiSummaryCard.tsx
|   |   |   |-- DonutChartCard.tsx
|   |   |   |-- LineChartCard.tsx
|   |   |   |-- MetricCard.tsx
|   |   |   `-- StatusCards.tsx
|   |   |-- data
|   |   |   `-- dashboard.ts
|   |   |-- lib
|   |   |   `-- api.ts
|   |   `-- types
|   |       |-- chat.ts
|   |       `-- dashboard.ts
|   `-- tsconfig.json
`-- main.py
```

## 아키텍처

1. Next.js가 목업 대시보드 데이터를 사용해 화면을 렌더링합니다.
2. UI는 AI 기능을 위해 FastAPI 엔드포인트를 호출합니다.
3. FastAPI는 대시보드 데이터를 프롬프트에 포함합니다.
4. FastAPI는 `qwen3.5:9b` 모델을 사용해 Ollama `/api/chat`을 호출합니다.
5. FastAPI는 정규화된 JSON 응답을 대시보드로 반환합니다.

## 백엔드 엔드포인트

- `POST /ai/summary`: 자연어 요약, 위험 경고, 실행 추천을 반환합니다.
- `POST /ai/insights`: 3-5개의 AI 인사이트를 반환합니다.
- `POST /ai/chat`: 현재 대시보드 데이터를 바탕으로 질문에 답합니다.
- `POST /chat`: 호환성을 위해 유지한 기본 채팅 엔드포인트입니다.

## Ollama 실행

```powershell
ollama pull qwen3.5:9b
ollama serve
```

`ollama serve` 실행 시 `11434` 포트가 이미 사용 중이라고 나오면 Ollama가 이미 실행 중인 것입니다.

## 백엔드 실행

```powershell
cd C:\Users\pc\Desktop\tjrwldnjs\backend
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
.\.venv\Scripts\python.exe -m uvicorn app.main:app --reload --port 8000
```

## 프론트엔드 실행

PowerShell 실행 정책 때문에 `npm`이 막히면 `npm.cmd`를 사용하세요.

```powershell
cd C:\Users\pc\Desktop\tjrwldnjs\frontend
npm.cmd install
npm.cmd run dev
```

브라우저에서 엽니다.

```text
http://localhost:3000
```

## 환경 변수

백엔드:

```text
APP_OLLAMA_BASE_URL=http://localhost:11434
APP_OLLAMA_MODEL=qwen3.5:9b
APP_CORS_ORIGINS=["http://localhost:3000"]
```

프론트엔드:

```text
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```
