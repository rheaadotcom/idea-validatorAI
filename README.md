# 🚀 IdeaValidator AI — AI-Powered Startup Idea Validator

Validate your startup ideas instantly using AI-powered market analysis, competitor research, and risk assessment.

---

## ✨ Features

- **AI-Powered Analysis** — Submit any startup idea and get instant analysis powered by OpenAI GPT-4o-mini
- **Smart Demo Mode** — Works even without OpenAI credits; automatically falls back to intelligent domain-aware demo analysis
- **Circuit Breaker** — Prevents repeated API failures; auto-retries after 5 minutes
- **Competitor Analysis** — Real competitor identification with differentiation insights
- **Risk Assessment** — Low / Medium / High risk scoring with justification
- **Profitability Score** — 0–100 score based on market potential
- **Tech Stack Suggestions** — Practical technology recommendations
- **AI Pitch Deck** — Generate a 10-slide pitch deck for any validated idea
- **User Dashboard** — Save, view, and manage all your validated ideas
- **Authentication** — Secure email/password auth via NextAuth.js
- **Dark Mode** — Full theme support via next-themes

---

## 🛠 Tech Stack

| Layer        | Technology                          |
|--------------|-------------------------------------|
| Framework    | Next.js 14 (App Router)             |
| Frontend     | React 18, Framer Motion, Lucide     |
| Styling      | Tailwind CSS 3                      |
| Auth         | NextAuth.js (Credentials Provider)  |
| Database     | MongoDB (Mongoose ODM)              |
| AI           | OpenAI GPT-4o-mini                  |
| Deployment   | Vercel-ready                        |

---

## 📦 Getting Started

### Prerequisites

- **Node.js** 18+ installed
- **MongoDB** Atlas account (free tier works) — [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
- **OpenAI API Key** (optional — app works in demo mode without it)

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd AI-Powered-Startup-Idea
npm install
```

### 2. Configure Environment

Create a `.env.local` file in the project root:

```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/startup-validator

# OpenAI API Key (optional — demo mode activates automatically without it)
OPENAI_API_KEY=sk-your-key-here

# NextAuth Configuration
NEXTAUTH_SECRET=your_random_secret_string
NEXTAUTH_URL=http://localhost:3000
```

### 3. Run the Dev Server

```bash
npm run dev
```

The smart dev server will:
- ✅ Automatically detect if port 3000 is busy
- ✅ Kill stale processes on port 3000 (Windows/Mac/Linux)
- ✅ Fall back to ports 3001–3010 if needed
- ✅ Print the correct URL to the console

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production

```bash
npm run build
npm start
```

---

## 📁 Project Structure

```
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── [...nextauth]/route.js   # NextAuth config
│   │   │   └── register/route.js        # User registration
│   │   └── ideas/
│   │       ├── route.js                 # GET (list) / POST (create+analyze)
│   │       └── [id]/
│   │           ├── route.js             # GET / DELETE single idea
│   │           └── pitch/route.js       # POST generate pitch deck
│   ├── dashboard/page.js                # User dashboard
│   ├── idea/[id]/page.js                # Idea detail + pitch deck
│   ├── login/page.js                    # Login page
│   ├── register/page.js                 # Register page
│   ├── layout.js                        # Root layout
│   ├── page.js                          # Home page (idea submission)
│   └── globals.css                      # Global styles
├── components/
│   ├── Navbar.js                        # Navigation bar
│   └── Providers.js                     # SessionProvider + ThemeProvider
├── lib/
│   └── db.js                            # MongoDB connection (with safe fallback)
├── models/
│   ├── User.js                          # User schema
│   └── Idea.js                          # Idea + Analysis schema
├── dev-start.js                         # Smart port-finding dev launcher
├── next.config.js                       # Next.js configuration
├── tailwind.config.js                   # Tailwind configuration
└── package.json
```

---

## 🔒 Fault Tolerance

This project is built to **never crash**, even under adverse conditions:

| Scenario                        | Behavior                                              |
|---------------------------------|-------------------------------------------------------|
| Port 3000 already in use        | Auto-kills stale process or switches to 3001+         |
| OpenAI API key missing          | Demo mode activates automatically                     |
| OpenAI returns 429 / quota exceeded | Circuit breaker trips; demo mode for 5 min       |
| OpenAI times out                | 10s abort; falls back to demo analysis                |
| MongoDB connection fails        | Returns graceful error JSON; app still serves pages   |
| Invalid request body            | Returns `{ success: false }` JSON, never crashes      |
| Any unhandled error             | Caught at route level; returns safe JSON response     |

---

## 📜 Available Scripts

| Command          | Description                                    |
|------------------|------------------------------------------------|
| `npm run dev`    | Start with smart port detection (recommended)  |
| `npm run dev:next` | Direct `next dev` (default port)             |
| `npm run dev:3001`| Start on port 3001 explicitly                 |
| `npm run build`  | Production build                               |
| `npm start`      | Start production server                        |
| `npm run lint`   | Run ESLint                                     |

---

## 🤖 Demo Mode

When the OpenAI API is unavailable (no key, quota exceeded, network error), the app automatically switches to **Demo Mode**:

- Detects the **domain** of your idea (food, health, education, finance, AI, general)
- Returns **real competitor names** relevant to your domain
- Generates a **profitability score** based on description detail
- Provides a **full pitch deck** with 10 realistic slides
- All responses are instant (no API latency)

A toast notification informs users when demo mode is active.

---

