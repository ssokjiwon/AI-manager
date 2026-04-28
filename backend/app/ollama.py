import httpx

from app.config import settings
from app.schemas import ChatMessage


class OllamaClient:
    def __init__(self) -> None:
        self._base_url = settings.ollama_base_url.rstrip("/")
        self._timeout = httpx.Timeout(settings.request_timeout_seconds)

    async def chat(self, messages: list[ChatMessage]) -> str:
        payload = {
            "model": settings.ollama_model,
            "messages": [message.model_dump() for message in messages],
            "stream": False,
            "think": False,
            "options": {
                "temperature": 0.2,
                "num_predict": 512,
            },
        }

        async with httpx.AsyncClient(timeout=self._timeout) as client:
            response = await client.post(f"{self._base_url}/api/chat", json=payload)
            response.raise_for_status()

        data = response.json()
        content = data.get("message", {}).get("content")
        if not isinstance(content, str):
            raise ValueError("Ollama 응답에 message.content가 없습니다")

        return content
