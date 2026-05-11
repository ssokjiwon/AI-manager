# AI 일정 관리 앱

할 일을 추가하고 일정을 관리하는 로컬 AI 웹 앱입니다.

![AI 일정 관리 앱 스크린샷](docs/assets/app-screenshot.png)

- 프론트엔드: Next.js, TypeScript, Tailwind CSS
- 백엔드: FastAPI
- LLM: Ollama
- 모델: `qwen3.5:9b`
- 주요 기능: 할 일 추가, 일정 추가, 완료 처리, AI 업무 요약, AI 채팅

## 파일 구조

```text
.
|-- README.md
|-- main.py
|-- docs
|   `-- assets
|       `-- app-screenshot.png
|-- backend
|   |-- .env.example
|   |-- requirements.txt
|   `-- app
|       |-- __init__.py
|       |-- config.py
|       |-- main.py
|       |-- ollama.py
|       `-- schemas.py
`-- frontend
    |-- .env.local.example
    |-- eslint.config.mjs
    |-- next-env.d.ts
    |-- next.config.ts
    |-- package.json
    |-- package-lock.json
    |-- postcss.config.mjs
    |-- tailwind.config.ts
    |-- tsconfig.json
    `-- src
        |-- app
        |   |-- globals.css
        |   |-- layout.tsx
        |   `-- page.tsx
        |-- components
        |   |-- AiChatPanel.tsx
        |   `-- AiSummaryCard.tsx
        |-- data
        |   `-- dashboard.ts
        |-- lib
        |   `-- api.ts
        `-- types
            |-- chat.ts
            `-- dashboard.ts
```

## 주요 화면

- 할 일 추가: 제목, 마감일, 우선순위를 입력합니다.
- 일정 추가: 일정 이름, 날짜, 시간, 장소를 입력합니다.
- 할 일 목록: 항목을 클릭해 완료 또는 진행 상태를 바꿉니다.
- 일정 목록: 등록된 일정을 확인합니다.
- AI 업무 요약: 현재 할 일과 일정을 바탕으로 주의점과 추천 행동을 생성합니다.
- AI 채팅 패널: 현재 할 일과 일정에 대해 질문할 수 있습니다.

## 아키텍처

1. Next.js가 할 일과 일정 관리 화면을 렌더링합니다.
2. 사용자는 할 일과 일정을 추가하고 목록을 확인합니다.
3. AI 요약과 AI 채팅은 현재 할 일과 일정 데이터를 FastAPI로 보냅니다.
4. FastAPI는 데이터를 프롬프트에 포함해 Ollama `/api/chat`을 호출합니다.
5. Ollama 응답을 프론트엔드에 반환합니다.

## 백엔드 엔드포인트

- `POST /ai/summary`: 할 일과 일정 기반 요약, 주의점, 추천 행동을 반환합니다.
- `POST /ai/chat`: 현재 할 일과 일정에 대한 질문에 답합니다.
- `POST /chat`: 기본 채팅 엔드포인트입니다.

## Ollama 실행

```powershell
ollama pull qwen3.5:9b
ollama serve
```

`11434` 포트가 이미 사용 중이라고 나오면 Ollama가 이미 실행 중인 것입니다.

## 백엔드 실행

```powershell
cd C:\Users\pc\Desktop\tjrwldnjs\backend
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
.\.venv\Scripts\python.exe -m uvicorn app.main:app --reload --port 8000
```

## 프론트엔드 실행

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
