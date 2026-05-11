from typing import Literal

from pydantic import BaseModel, Field


Role = Literal["system", "user", "assistant"]


class ChatMessage(BaseModel):
    role: Role
    content: str = Field(min_length=1)


class ChatRequest(BaseModel):
    prompt: str = Field(min_length=1)
    messages: list[ChatMessage] = Field(default_factory=list)


class ChatResponse(BaseModel):
    message: ChatMessage


class DashboardAiRequest(BaseModel):
    dashboard: dict


class DashboardChatRequest(DashboardAiRequest):
    question: str = Field(min_length=1)
    messages: list[ChatMessage] = Field(default_factory=list)


class AiSummaryResponse(BaseModel):
    summary: str
    warnings: list[str]
    recommendations: list[str]


class AiChatResponse(BaseModel):
    answer: str
