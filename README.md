# AI Voice Agent – React + Spring Boot Demo

This repository contains a reusable React `<VoiceAgent appId="APP_ID" />` component, a Spring Boot case backend (H2), and a Node.js Voice Agent Server that serves app context and collects learning telemetry.

## Prerequisites
- Node.js 18+
- Java 17+
- Maven 3.9+

## Run All Services (3 terminals)

1) Voice Agent Server (context + telemetry)
```
cd voice-agent-server
npm install
npm run dev
```
Runs on `http://localhost:8081`.

2) Spring Boot Case Backend (H2)
```
cd backend-spring
mvn spring-boot:run
```
Runs on `http://localhost:8080`.

3) React Frontend (Vite)
```
cd frontend
npm install
npm run dev
```
Runs on `http://localhost:5173` and proxies:
- `/voice-agent/*` → `http://localhost:8081`
- `/api/*` → `http://localhost:8080`

## How It Works
- STT converts speech to text (Web Speech API)
- AI Core parses intent and entities, plans UI/API actions
- UI Controller fires DOM events and visual overlays
- Backend API is called when needed (e.g., email bank)
- TTS gives feedback; telemetry updates learning heuristics

## Demo Voice Commands
- "Show my pending cases"
- "Show my cases"
- "Filter status open"
- "Upload Excel file" (triggers upload placeholder)
- "Email bank for case 1"

## Integrate Into Any React App
Mount the component anywhere in your app:
```tsx
import { VoiceAgent } from './components/VoiceAgent';

<VoiceAgent appId="YOUR_APP_ID" />
```
Provide the app context via the Voice Agent Server:
- `GET /voice-agent/context/:appId` → returns JSON context

## Notes
- H2 is in-memory; sample data is seeded at startup
- Web Speech API support may vary by browser (Chrome recommended)
- Replace rule-based NLP with an LLM API for richer intents when ready


