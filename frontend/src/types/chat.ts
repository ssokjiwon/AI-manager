export type ChatRole = "system" | "user" | "assistant";

export type ChatMessage = {
  role: ChatRole;
  content: string;
};

export type ChatRequest = {
  prompt: string;
  messages: ChatMessage[];
};

export type ChatResponse = {
  message: ChatMessage;
};
