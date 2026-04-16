# AI Crypto Research Copilot 🤖

An AI-powered crypto token research tool. Search any token by name or contract address and get an instant structured analysis — risk score, tokenomics, sentiment, and a final verdict.

## Features

- 🔍 **Smart search** with live autocomplete and contract address detection
- 📊 **Live market data** from CoinGecko (price, market cap, volume, supply)
- 📈 **Interactive price chart** (7D / 30D / 90D range selector)
- 🤖 **AI analysis** with 5 structured cards — Summary, Risk Score, Tokenomics, Sentiment, Verdict
- 🎯 **Animated risk gauge** (0–100) with color coding
- 🔥 **Trending tokens** on the landing page
- 💾 **Server-side caching** to stay within API rate limits
- ⚡ **Skeleton loaders** and error states with retry

## Quick Start

### 1. Clone & Install

```bash
cd "AI Crypto Research Copilot"
npm install
```

### 2. Configure Environment

```bash
copy .env.example .env.local
```

Edit `.env.local` and fill in your API keys:

```env
# Option A — OpenAI (paid)
AI_API_KEY=sk-...
AI_API_URL=https://api.openai.com/v1
AI_MODEL=gpt-4o-mini

# Option B — Groq (free tier at console.groq.com)
AI_API_KEY=gsk_...
AI_API_URL=https://api.groq.com/openai/v1
AI_MODEL=llama-3.3-70b-versatile
```

> CoinGecko free tier works without an API key.

### 3. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/
│   ├── page.js              # Landing page
│   ├── token/[id]/page.js   # Token analysis page
│   └── api/                 # Backend API routes
│       ├── search/          # Autocomplete
│       ├── token/[id]/      # Token data
│       ├── analyze/         # AI analysis
│       ├── trending/        # Trending tokens
│       └── chart/[id]/      # Price chart
├── components/
│   ├── analysis/            # 5 AI analysis cards
│   ├── token/               # Token display components
│   ├── search/              # Search bar
│   ├── trending/            # Trending list
│   ├── layout/              # Header
│   └── ui/                  # Primitives (Card, Badge, Skeleton)
└── lib/
    ├── api/coingecko.js     # CoinGecko API client
    ├── ai/client.js         # AI API client
    ├── ai/prompts.js        # Prompt templates
    ├── cache.js             # In-memory cache
    ├── utils.js             # Formatting helpers
    └── constants.js         # App constants
```

## AI Provider Compatibility

Works with any OpenAI-compatible endpoint:

| Provider | Free Tier | Model |
|----------|-----------|-------|
| OpenAI | ❌ Paid | `gpt-4o-mini` |
| Groq | ✅ Free | `llama-3.3-70b-versatile` |
| Ollama (local) | ✅ Local | `llama3.2` |

## Disclaimer

This tool is for **research purposes only**. Nothing here constitutes financial advice.
