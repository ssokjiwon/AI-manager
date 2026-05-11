import json

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import httpx

from app.config import settings
from app.ollama import OllamaClient
from app.schemas import (
    AiChatResponse,
    AiSummaryResponse,
    ChatMessage,
    ChatRequest,
    ChatResponse,
    DashboardAiRequest,
    DashboardChatRequest,
)


app = FastAPI(title="로컬 AI 일정 관리 API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["POST", "GET", "OPTIONS"],
    allow_headers=["*"],
)

ollama_client = OllamaClient()


@app.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest) -> ChatResponse:
    messages = [*request.messages, ChatMessage(role="user", content=request.prompt)]

    try:
        content = await ollama_client.chat(messages)
    except httpx.HTTPStatusError as exc:
        raise HTTPException(
            status_code=502,
            detail=f"Ollama가 HTTP {exc.response.status_code}를 반환했습니다",
        ) from exc
    except httpx.RequestError as exc:
        raise HTTPException(
            status_code=503,
            detail=f"{settings.ollama_base_url}의 Ollama에 연결할 수 없습니다",
        ) from exc
    except ValueError as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc

    return ChatResponse(message=ChatMessage(role="assistant", content=content))


@app.post("/ai/summary", response_model=AiSummaryResponse)
async def ai_summary(request: DashboardAiRequest) -> AiSummaryResponse:
    planner_json = _dashboard_json(request.dashboard)
    prompt = f"""
당신은 할 일과 일정을 관리해 주는 한국어 AI 비서입니다.
아래 데이터를 보고 엄격한 JSON만 반환하세요.

할 일과 일정 데이터:
{planner_json}

반환 형식:
{{
  "summary": "오늘 또는 이번 주에 집중해야 할 내용을 한두 문장으로 요약",
  "warnings": ["마감 임박, 일정 충돌, 과부하 같은 주의점"],
  "recommendations": ["다음 행동 1", "다음 행동 2", "다음 행동 3"]
}}

규칙:
- 반드시 한국어로 답하세요.
- 마크다운을 포함하지 마세요.
- 없는 데이터는 추측하지 마세요.
- 할 일 우선순위, 마감일, 일정 시간을 중심으로 판단하세요.
"""

    content = await _ask_ollama(prompt)
    data = _extract_json(content)

    if isinstance(data, dict):
        return AiSummaryResponse(
            summary=_string_or_default(data.get("summary"), content),
            warnings=_string_list(data.get("warnings")),
            recommendations=_string_list(data.get("recommendations")),
        )

    return AiSummaryResponse(summary=content, warnings=[], recommendations=[])


@app.post("/ai/chat", response_model=AiChatResponse)
async def ai_chat(request: DashboardChatRequest) -> AiChatResponse:
    planner_json = _dashboard_json(request.dashboard)
    history = "\n".join(
        f"{message.role}: {message.content}" for message in request.messages[-8:]
    )
    prompt = f"""
당신은 사용자의 할 일과 일정을 도와주는 한국어 AI 비서입니다.

할 일과 일정 데이터:
{planner_json}

최근 대화:
{history}

사용자 질문:
{request.question}

데이터에 근거해 짧고 실용적으로 답하세요.
일정 충돌, 우선순위, 오늘 먼저 할 일, 마감 임박 항목을 잘 판단하세요.
데이터가 부족하면 무엇이 부족한지 말하세요.
"""

    content = await _ask_ollama(prompt)
    return AiChatResponse(answer=content)


async def _ask_ollama(prompt: str) -> str:
    try:
        return await ollama_client.chat([ChatMessage(role="user", content=prompt)])
    except httpx.HTTPStatusError as exc:
        raise HTTPException(
            status_code=502,
            detail=f"Ollama가 HTTP {exc.response.status_code}를 반환했습니다",
        ) from exc
    except httpx.RequestError as exc:
        raise HTTPException(
            status_code=503,
            detail=f"{settings.ollama_base_url}의 Ollama에 연결할 수 없습니다",
        ) from exc
    except ValueError as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc


def _dashboard_json(dashboard: dict) -> str:
    return json.dumps(dashboard, ensure_ascii=False, indent=2)


def _extract_json(content: str) -> dict | None:
    start = content.find("{")
    end = content.rfind("}")
    if start == -1 or end == -1 or end <= start:
        return None

    try:
        parsed = json.loads(content[start : end + 1])
    except json.JSONDecodeError:
        return None

    return parsed if isinstance(parsed, dict) else None


def _string_or_default(value: object, default: str) -> str:
    return value if isinstance(value, str) and value.strip() else default


def _string_list(value: object) -> list[str]:
    if not isinstance(value, list):
        return []

    return [item.strip() for item in value if isinstance(item, str) and item.strip()]

