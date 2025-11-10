# 🚀 SYNRGY v4.4.0 — NEXT STEPS

**Current Status:** Auth Prisma + JWT + Cookies Fixed  
**Next Phase:** Testing & Deployment

---

## ✅ COMPLETED

**Phase 5.3 - Auth Migration:**
- ✅ PostgreSQL setup (Docker)
- ✅ Prisma schema created
- ✅ Migration applied (User, Client, Program, NutritionPlan tables)
- ✅ Auth routes with JWT + cookies
- ✅ Middleware authPrisma created
- ✅ CORS credentials enabled
- ✅ Cookie configuration fixed (sameSite)
- ✅ JWT_SECRET in .env
- ✅ Prisma Client generated

---

## 🎯 IMMEDIATE NEXT STEPS

### 1. Test Auth Endpoints (NOW)

```bash
# Terminal 1
npm run dev:server

# Terminal 2
./TEST-AUTH-ENDPOINTS.sh
```

**Expected:**
```
✅ Signup successful
✅ Login successful
✅ Get Me successful
✅ Logout successful
✅ Correctly denied after logout

🎉 ALL TESTS PASSED (5/5)
```

---

### 2. Adapt Frontend AuthContext

**File:** `client/src/contexts/AuthContext.tsx`

**Changes needed:**

```typescript
// Add credentials to all auth requests
const signup = async (email: string, password: string, role: string, fullName: string) => {
  const res = await fetch('/api/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, role, fullName }),
    credentials: 'include', // ✅ CRITICAL
  });
  // ...
};

const login = async (email: string, password: string) => {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
    credentials: 'include', // ✅ CRITICAL
  });
  // ...
};

const getMe = async () => {
  const res = await fetch('/api/auth/me', {
    credentials: 'include', // ✅ CRITICAL
  });
  // ...
};

const logout = async () => {
  await fetch('/api/auth/logout', {
    method: 'POST',
    credentials: 'include', // ✅ CRITICAL
  });
  setUser(null);
};
```

---

### 3. Test Frontend Login Flow

```bash
# Terminal 1: Backend
npm run dev:server

# Terminal 2: Frontend
npm run dev:client

# Browser
open http://localhost:5173/login
```

**Test:**
1. ✅ Signup new account (coach@test.com)
2. ✅ Login with account
3. ✅ Redirect to /coach/dashboard
4. ✅ Refresh page → Still logged in
5. ✅ Logout → Redirect to /
6. ✅ Try access /coach/dashboard → Redirect to /login

---

### 4. Remove Legacy Auth (Cleanup)

```bash
# Delete old SQLite auth
rm dev.db
rm server/auth/authController.ts
rm server/auth/userStore.ts
rm scripts/create-test-users.ts

# Update server/index.ts
# Remove line:
# import authRouter from "./auth/authRoutes.js";

# Keep only:
# import authPrismaRouter from "./routes/auth.js";
# app.use("/api/auth", authLimiter, authPrismaRouter);
```

---

## 🚀 PHASE 5.4 — DEPLOYMENT

### Backend (Render)

**1. Create PostgreSQL Database**
- Go to render.com
- New PostgreSQL
- Name: synrgy-db
- Copy Database URL

**2. Create Web Service**
- New Web Service
- Connect GitHub repo
- Build: `npm install`
- Start: `npm run build && npm start`

**3. Environment Variables**
```
NODE_ENV=production
PORT=5001
DATABASE_URL=postgresql://... (from Render)
JWT_SECRET=<generate_random_32_chars>
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLIC_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_COACH=price_...
STRIPE_PRICE_CLIENT=price_...
OLLAMA_URL=http://localhost:11434 (or cloud AI)
FRONTEND_URL=https://synrgy.vercel.app
```

**4. Deploy**
- Push to GitHub
- Render auto-deploys
- Run migration: `npx prisma migrate deploy`

---

### Frontend (Vercel)

**1. Connect GitHub**
- Go to vercel.com
- Import project
- Framework: Vite

**2. Environment Variables**
```
VITE_API_URL=https://synrgy-backend.onrender.com
```

**3. Build Settings**
- Build command: `npm run build`
- Output directory: `dist`

**4. Deploy**
- Push to GitHub
- Vercel auto-deploys

---

## 📊 TESTING CHECKLIST

### Local Tests
- [ ] Backend starts without errors
- [ ] POST /signup creates user in DB
- [ ] POST /login returns JWT + cookie
- [ ] GET /me returns user data
- [ ] POST /logout clears cookie
- [ ] Frontend login flow works
- [ ] Refresh page keeps session
- [ ] Logout clears session

### Production Tests
- [ ] Backend deployed on Render
- [ ] Frontend deployed on Vercel
- [ ] PostgreSQL connected
- [ ] Prisma migrations run
- [ ] Auth works end-to-end
- [ ] CORS configured correctly
- [ ] HTTPS enabled
- [ ] Cookies work cross-domain

---

## 🔒 SECURITY CHECKLIST (Production)

- [ ] JWT_SECRET strong (32+ chars random)
- [ ] HTTPS enabled (secure: true cookies)
- [ ] CORS origin restricted to frontend domain
- [ ] Rate limiting enabled
- [ ] Helmet security headers
- [ ] Environment variables secure
- [ ] No secrets in code
- [ ] Database backups enabled

---

## 📝 DOCUMENTATION TO UPDATE

- [ ] README.md (deployment instructions)
- [ ] API.md (auth endpoints)
- [ ] CONTRIBUTING.md (setup guide)
- [ ] CHANGELOG.md (version 5.3)

---

## 🎯 MILESTONES

**Phase 5.3 - Auth Migration:** 🟢 Complete  
**Phase 5.4 - Testing:** 🟡 In Progress  
**Phase 5.5 - Deployment:** 🔴 Not Started  
**Phase 5.6 - Marketing Launch:** 🔴 Not Started  

---

## 🚀 IMMEDIATE ACTION

**Right now:**

```bash
# Terminal 1
cd /Users/ethan.plnqrt/Downloads/CoachPro-Saas-main
npm run dev:server

# Terminal 2
./TEST-AUTH-ENDPOINTS.sh
```

**Then report results!** 🎯

---

**✅ Phase 5.3 Complete — Ready for Testing & Deployment** 🚀

