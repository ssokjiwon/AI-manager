# AI 일정 관리 앱

할 일을 추가하고 일정을 관리하는 로컬 AI 웹 앱입니다.

![AI 일정 관리 앱 스크린샷](docs/assets/app-screenshot.png)

- 프론트엔드, Next.js, TypeScript, Tailwind CSS
- 백엔드, FastAPI
- LLM, Ollama
- 모델, `qwen3.5:9b`
- 주요 기능, 할 일 추가, 일정 추가, 완료 처리, AI 업무 요약, AI 채팅

## 구조

```text
frontend, Next.js 웹 앱
backend, FastAPI API 서버
Ollama, qwen3.5:9b 모델 서버
```

요청 흐름은 아래와 같습니다.

```text
브라우저, Next.js, FastAPI, Ollama
```

## Cloudtype 배포 구성

Cloudtype에는 서비스를 2개로 나누어 배포합니다.

```text
서비스 1, backend
서비스 2, frontend
```

중요합니다. Ollama는 Cloudtype의 frontend나 backend 컨테이너 안에 자동으로 포함되지 않습니다. AI 기능을 배포 환경에서 쓰려면 Ollama가 실행 중인 별도 서버가 필요합니다. 예를 들어 개인 GPU 서버, VPS, 또는 Ollama 전용 컨테이너를 준비하고 FastAPI가 접근할 수 있는 URL을 `APP_OLLAMA_BASE_URL`에 넣어야 합니다.

## Cloudtype, backend 배포

Cloudtype에서 새 서비스를 만들고 다음처럼 설정합니다.

- 템플릿, Dockerfile
- Git 저장소, 이 저장소
- Dockerfile 경로, `backend/Dockerfile`
- Port, `8000`
- Health Check, `/health`

환경 변수:

```text
PORT=8000
APP_OLLAMA_BASE_URL=https://your-ollama-server.example.com
APP_OLLAMA_MODEL=qwen3.5:9b
APP_CORS_ORIGINS=["https://your-frontend-domain.com"]
```

`APP_OLLAMA_BASE_URL`은 Cloudtype 백엔드 서버 기준에서 접근 가능한 Ollama 주소여야 합니다. 로컬 개발에서는 `http://localhost:11434`를 쓰지만, Cloudtype 배포에서는 Cloudtype 컨테이너의 localhost가 사용자 PC가 아닙니다.

## Cloudtype, frontend 배포

Cloudtype에서 새 서비스를 하나 더 만들고 다음처럼 설정합니다.

- 템플릿, Dockerfile
- Git 저장소, 이 저장소
- Dockerfile 경로, `frontend/Dockerfile`
- Port, `3000`

Environment Variables:

```text
PORT=3000
BACKEND_API_BASE_URL=https://your-backend-domain.com
```

프론트엔드는 `/api/...` 경로로 들어온 요청을 Next.js 서버에서 FastAPI 백엔드로 프록시합니다. 그래서 Cloudtype에서는 `BACKEND_API_BASE_URL`만 런타임 환경변수로 넣으면 됩니다.

## 배포 순서

1. Ollama 서버를 준비합니다.
2. Ollama 서버에서 모델을 받습니다.

```powershell
ollama pull qwen3.5:9b
ollama serve
```

3. Cloudtype에 backend 서비스를 먼저 배포합니다.
4. backend URL로 헬스 체크를 확인합니다.

```text
https://your-backend-domain.com/health
```

5. Cloudtype에 frontend 서비스를 배포합니다.
6. frontend의 `BACKEND_API_BASE_URL` 환경 변수에 backend URL을 넣습니다.
7. backend의 `APP_CORS_ORIGINS`에 frontend URL을 넣습니다.
8. 두 서비스를 다시 배포합니다.

## 로컬 실행

Ollama:

```powershell
ollama pull qwen3.5:9b
ollama serve
```

백엔드:

```powershell
cd C:\Users\pc\Desktop\tjrwldnjs\backend
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
.\.venv\Scripts\python.exe -m uvicorn app.main:app --reload --port 8000
```

프론트엔드:

```powershell
cd C:\Users\pc\Desktop\tjrwldnjs\frontend
npm.cmd install
npm.cmd run dev
```

브라우저에서 엽니다.

```text
http://localhost:3000
```

## 추가된 배포 파일

```text
backend/Dockerfile
backend/.dockerignore
frontend/Dockerfile
frontend/.dockerignore
.cloudtype/backend.yaml
.cloudtype/frontend.yaml
```

## 참고

브라우저에서 FastAPI를 직접 호출하고 싶다면 frontend에 `NEXT_PUBLIC_API_BASE_URL`을 별도로 설정할 수 있습니다. 설정하지 않으면 기본값은 `/api`이고, Next.js 서버 프록시를 통해 backend로 요청합니다.
