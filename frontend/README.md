# Voice Agent Demo (Frontend)

Quick start:

```
cd frontend
npm install
npm run dev
```

This launches the React app with a floating mic. It proxies:
- `/voice-agent/*` to `http://localhost:8081`
- `/api/*` to `http://localhost:8080`

Mount `<VoiceAgent appId="demoApp" />` in any React app to enable voice commands.


