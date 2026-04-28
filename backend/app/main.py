import json

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import httpx

from app.config import settings
from app.ollama import OllamaClient
from app.schemas import (
    AiChatResponse,
    AiInsightsResponse,
    AiSummaryResponse,
    ChatMessage,
    ChatRequest,
    ChatResponse,
    DashboardAiRequest,
    DashboardChatRequest,
)


app = FastAPI(title="로컬 AI 분석 API")

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
    dashboard_json = _dashboard_json(request.dashboard)
    prompt = f"""
당신은 분석 대시보드 어시스턴트입니다. 아래 대시보드 데이터를 분석하고 엄격한 JSON만 반환하세요.

대시보드 데이터:
{dashboard_json}

다음 JSON 형식으로 반환하세요:
{{
  "summary": "간결한 자연어 요약 한 문장",
  "warnings": ["위험 경고 1", "위험 경고 2"],
  "recommendations": ["다음 실행 항목 1", "다음 실행 항목 2", "다음 실행 항목 3"]
}}

규칙:
- 비정상 값, 급격한 변화, 운영 리스크를 언급하세요.
- 각 경고와 추천은 짧게 작성하세요.
- 마크다운을 포함하지 마세요.
- 모든 답변은 한국어로 작성하세요.
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


@app.post("/ai/insights", response_model=AiInsightsResponse)
async def ai_insights(request: DashboardAiRequest) -> AiInsightsResponse:
    dashboard_json = _dashboard_json(request.dashboard)
    prompt = f"""
당신은 분석 대시보드 어시스턴트입니다. 대시보드 데이터에서 유용한 인사이트 3-5개를 생성하세요.

대시보드 데이터:
{dashboard_json}

엄격한 JSON만 반환하세요:
{{
  "insights": ["인사이트 1", "인사이트 2", "인사이트 3"]
}}

규칙:
- 실제 지표 값과 변화율을 사용하세요.
- 매출, 활동, 위험, 전환율, 최근 이벤트를 우선적으로 다루세요.
- 마크다운을 포함하지 마세요.
- 모든 답변은 한국어로 작성하세요.
"""

    content = await _ask_ollama(prompt)
    data = _extract_json(content)

    if isinstance(data, dict):
        insights = _string_list(data.get("insights"))
        if insights:
            return AiInsightsResponse(insights=insights[:5])

    return AiInsightsResponse(insights=_lines(content)[:5])


@app.post("/ai/chat", response_model=AiChatResponse)
async def ai_chat(request: DashboardChatRequest) -> AiChatResponse:
    dashboard_json = _dashboard_json(request.dashboard)
    history = "\n".join(
        f"{message.role}: {message.content}" for message in request.messages[-8:]
    )
    prompt = f"""
당신은 이 대시보드에 대한 질문에 답하는 분석 어시스턴트입니다.

대시보드 데이터:
{dashboard_json}

최근 대화:
{history}

사용자 질문:
{request.question}

데이터에 근거해 간결하게 한국어로 답하세요. 데이터가 부족하면 무엇이 부족한지 말하세요.
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


def _lines(content: str) -> list[str]:
    cleaned = []
    for line in content.splitlines():
        item = line.strip().lstrip("-*0123456789. ")
        if item:
            cleaned.append(item)
    return cleaned
