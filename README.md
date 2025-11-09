# 🔥 SYNRGY v4.3.0

**The intelligent, connected coaching platform.**  
TrueCoach Pro + Hevy Logging + Macros Sync + AI Coherence.

**Now in 5 languages:** 🇫🇷 🇬🇧 🇪🇸 🇮🇹 🇩🇪

---

## ⚡ Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Create .env file
bash scripts/create-env.sh

# 3. Launch (3 terminals)
# Terminal 1
ollama serve

# Terminal 2
npm run dev:server

# Terminal 3
npm run dev:client

# 4. Open
open http://localhost:5173
```

---

## 🌍 Internationalization

Synrgy supports 5 languages:
- 🇫🇷 **Français** (default)
- 🇬🇧 **English**
- 🇪🇸 **Español**
- 🇮🇹 **Italiano**
- 🇩🇪 **Deutsch**

**Language selector:** Top-right on all public pages.  
**Auto-detection:** Uses browser language or saved preference.  
**AI responses:** Automatically in user's selected language.

---

## 🎯 Features

### For Coaches
- 💼 **TrueCoach Pro**: Professional client management
- 📊 **Program Builder**: Create training programs with drag & drop
- 🤖 **AI Insights**: Automated weekly summaries and alerts
- 💸 **Referral System**: Earn +10% commission
- 🌐 **Multilingual**: Serve clients worldwide

### For Clients
- 🏋️ **Hevy-Style Logging**: Intuitive workout tracking
- 🍎 **Macros Sync**: Connect Macros app for nutrition
- 💬 **AI Chat**: Get instant answers to training questions
- 📈 **Progress Tracking**: Visual stats and trends
- 🌍 **Your Language**: Interface in 5 languages

### For Everyone
- ✨ **Premium UX**: Beautiful glassmorphism design
- 🔐 **Secure Auth**: JWT + httpOnly cookies
- 💳 **Stripe Payments**: €29.90 (Coach) / €9.90 (Client)
- 🧠 **Local AI**: Ollama (Llama 3.2:3b) for privacy
- 📱 **Responsive**: Mobile + Desktop optimized

---

## 🏗️ Tech Stack

### Frontend
- **React 18** + TypeScript
- **Vite** (build tool)
- **React Router v6** (navigation)
- **Tailwind CSS** (styling)
- **Framer Motion** (animations)
- **i18next** (internationalization)
- **Shadcn/ui** (components)
- **TanStack Query** (data fetching)

### Backend
- **Express.js** (Node.js server)
- **Drizzle ORM** + SQLite (local dev)
- **JWT** + bcrypt (auth)
- **Stripe API** (payments)
- **Helmet** + Rate Limiting (security)
- **Ollama** (local AI)

### AI
- **Ollama** (Llama 3.2:3b model)
- **Retry logic** + timeout + cache
- **Multilingual** (5 languages)
- **Context-aware** responses

---

## 📦 Project Structure

```
synrgy/
├── client/                    # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/        # UI components
│   │   ├── pages/             # Route pages
│   │   ├── contexts/          # React contexts (Auth, Language)
│   │   ├── hooks/             # Custom hooks
│   │   ├── i18n/              # Translations (5 languages)
│   │   ├── lib/               # Utilities
│   │   └── styles/            # Global styles
│   └── public/                # Static assets
├── server/                    # Backend (Express + Drizzle)
│   ├── auth/                  # Authentication
│   ├── routes/                # API routes
│   ├── services/              # Business logic
│   ├── ai/                    # AI integration (Ollama)
│   └── utils/                 # Backend utilities
├── shared/                    # Shared types (schema.ts)
├── scripts/                   # Setup & test scripts
└── docs/                      # Documentation
```

---

## 🧪 Testing

```bash
# Run all pre-launch tests
npm run prelaunch

# Test Ollama connection
npm run test:ollama

# Test AI stability
npm run test:synrgy-ai
```

**Expected:**
```
✅ Environment Variables - All required variables present
✅ Ollama API - En ligne (2 modèles disponibles)
✅ Stripe API - Coach: 29.90€, Client: 9.90€
✅ Database (SQLite) - dev.db présent

🎉 ALL TESTS PASSED
```

---

## 🚀 Deployment

### Frontend (Vercel)
```bash
# Build
npm run build

# Deploy
vercel deploy --prod
```

### Backend (Render)
```yaml
# render.yaml
services:
  - type: web
    name: synrgy-backend
    env: node
    buildCommand: npm install
    startCommand: npm run start
    envVars:
      - key: NODE_ENV
        value: production
```

### Environment Variables
```env
# Required
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLIC_KEY=pk_live_...
OLLAMA_URL=http://localhost:11434
DATABASE_URL=file:./dev.db

# Optional
MACROS_CLIENT_ID=...
MACROS_CLIENT_SECRET=...
```

---

## 📚 Documentation

| Guide | Description |
|-------|-------------|
| **LANCEMENT-I18N.md** | Multilingual launch guide |
| **I18N-COMPLETE.md** | i18n technical documentation |
| **LANCEMENT-FINAL.md** | Complete launch procedure |
| **START-HERE.md** | Quick 2-minute setup |
| **OLLAMA-SETUP.md** | AI setup guide |
| **STRIPE-SETUP-GUIDE.md** | Payment integration |
| **docs/LAUNCH-GUIDE.md** | Production deployment |

---

## 🎨 Design System

### Colors
```css
--background: #0A1628;      /* Deep blue night */
--surface: #142038;         /* Card background */
--primary: #D4AF37;         /* Gold accent */
--text-primary: #F5F3EF;    /* Off-white */
--text-secondary: #A6A6A8;  /* Gray */
--success: #41E2BA;         /* Mint green */
```

### Typography
- **Font:** Inter (300-700 weights)
- **Headings:** Light weight, negative tracking
- **Body:** Readable, never dense

### Effects
- **Glassmorphism:** `backdrop-blur-lg` + semi-transparent backgrounds
- **Gold Glow:** Hover states on CTAs
- **Animations:** Framer Motion (fade, slide, scale)

---

## 🔐 Security

- **JWT Tokens:** httpOnly cookies + sameSite strict
- **Password Hashing:** bcrypt (12 rounds)
- **Rate Limiting:** Express rate limiter
- **Helmet:** Security headers
- **CORS:** Restricted origins
- **SQL Injection:** Drizzle ORM parameterized queries

---

## 🌟 Roadmap

### v4.4 (Next)
- [ ] Complete AI multilingual integration (x-user-lang header)
- [ ] Real-time websocket chat
- [ ] Mobile app (React Native)
- [ ] Exercise library with videos
- [ ] Advanced analytics dashboard

### v5.0 (Future)
- [ ] Team coaching (multiple coaches per organization)
- [ ] Marketplace (coaches selling programs)
- [ ] Wearable integration (Apple Watch, Garmin)
- [ ] Voice AI assistant
- [ ] Community challenges

---

## 🤝 Contributing

This is a private project. For support or questions:
- Email: support@synrgy.ai
- Discord: [Join our community](#)

---

## 📄 License

© 2025 Synrgy. All rights reserved.

---

## 🏆 Credits

**Built with passion by someone who loves fitness and code.**

Inspired by:
- **TrueCoach** (client management)
- **Hevy** (workout logging)
- **Macros** (nutrition tracking)
- **Notion** (clean UI)
- **Apple Fitness** (emotional design)

---

## 📊 Stats

- **Version:** 4.3.0
- **Lines of Code:** ~15,000
- **Languages:** 5 (fr, en, es, it, de)
- **Components:** 50+
- **Routes:** 30+
- **Translations:** 1,500+ strings
- **Build Time:** < 10s
- **First Paint:** < 2s

---

**🔥 Train Smart. Live Synrgy. 💪✨**
