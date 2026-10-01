# PakAutoReply-2026 (v1.9.4)
### Multi AI Provider + Dynamic API Key + Dynamic Model System
**Package**: `com.pakworld.pakautoreply`

Official multi-provider auto-reply engine inspired by WhatsAuto with real-time model discovery, Bring Your Own Key (BYOK) architecture, and ReplyEngine priority orchestration.

---

## 🌟 Supported AI Providers
1. **Gemini (Google AI Studio)** — Default (`gemini-3.8-flash`, `gemini-3.7-flash`, `gemini-3.5-flash-lite`, Free Tier eligible)
2. **ChatGPT (OpenAI Platform)** — `gpt-4o-mini`, `gpt-5.4-mini`, `gpt-4o`, `gpt-4.1-mini`
3. **Grok (xAI)** — `grok-3`, `grok-3-mini`, `grok-2`
4. **Meta AI / Llama** — `llama-3.3-70b-instruct`, `llama-3.1-405b`, `llama-3.1-8b`
5. **ElevenLabs** — Voice synthesis and conversational agent platform (with voice guard protecting plain text WhatsApp dispatch)
6. **Local AI / Low-Level (لو لیول)** — On-device offline inference (Ollama, LM Studio, DeepSeek R1 8B, Llama 3.2 3B)

---

## 🚦 ReplyEngine Priority Order
1. **Priority 1: Custom Reply Rules** (Exact, Contains, Regex pattern matching)
2. **Priority 2: Keyword Reply Rules** (Trigger words)
3. **Priority 3: Menu Reply System** (Interactive numbered option menus)
4. **Priority 4: Multi-Provider AI Fallback** (Selected provider and dynamic model parameters)

---

## 🚀 Quick Start (Development & Production)

### 1. Install dependencies
```bash
npm install
```

### 2. Environment Variables
Create a `.env` file:
```env
GEMINI_API_KEY="your-google-ai-studio-key"
PORT=3000
```

### 3. Run Dev Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production
```bash
npm run build
npm start
```

---

## 📱 Android & AIDE Integration Guide
- **SharedPreferences Keys**:
  - `selected_ai_provider`
  - `gemini_api_key`, `openai_api_key`, `xai_api_key`, `meta_api_key`, `elevenlabs_api_key`, `lowlevel_api_key`
  - `gemini_model`, `openai_model`, `xai_model`, `meta_model`, etc.
- **Java Core Files**:
  - `com.pakworld.pakautoreply.ai.AIProviderAdapter`
  - `com.pakworld.pakautoreply.ai.GeminiApi`
  - `com.pakworld.pakautoreply.engine.ReplyEngine`

---

## 📄 License
Apache License 2.0. Built for PakAutoReply-2026.
