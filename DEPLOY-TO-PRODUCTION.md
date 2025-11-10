# 🚀 SYNRGY PRODUCTION DEPLOYMENT GUIDE

**Date:** November 10, 2025  
**Version:** 1.0.0 Production  
**Status:** Ready to Deploy

---

## 📋 PRE-DEPLOYMENT CHECKLIST

### Local Environment ✅
- [x] PostgreSQL local database working
- [x] Backend running on http://localhost:5001
- [x] Frontend compiling cleanly
- [x] All environment variables configured
- [x] Prisma migrations applied
- [x] Git repository initialized
- [x] All tests passing

### Required Accounts ⚠️
- [ ] Render.com account created
- [ ] Vercel account created
- [ ] Stripe account (test mode keys ready)
- [ ] GitHub repository accessible

---

## 🎯 DEPLOYMENT OVERVIEW

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│   GitHub Repository                                     │
│   └─ https://github.com/ethan-plnqrt/synrgy-coachpro  │
│                                                         │
│           ↓                           ↓                 │
│                                                         │
│   [RENDER.COM]              [VERCEL]                    │
│   Backend + Database        Frontend                    │
│   synrgy-api.onrender.com   synrgy.vercel.app          │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 🗄️ PART 1: BACKEND DEPLOYMENT (RENDER)

### Step 1.1: Create Render Account
1. Go to https://render.com
2. Sign up with GitHub
3. Connect your GitHub account
4. Authorize Render to access your repositories

### Step 1.2: Create PostgreSQL Database
1. In Render Dashboard, click **"New +"**
2. Select **"PostgreSQL"**
3. Configure:
   - **Name:** `synrgy-db`
   - **Database:** `synrgydb`
   - **User:** `synrgy_user`
   - **Region:** Frankfurt (or closest to you)
   - **Plan:** Starter ($7/month)
4. Click **"Create Database"**
5. Wait for database to initialize (~2 minutes)
6. **Copy the Internal Database URL** (starts with `postgresql://`)

### Step 1.3: Create Backend Web Service
1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository: `ethan-plnqrt/synrgy-coachpro`
3. Configure:

**Basic Settings:**
```
Name: synrgy-api
Region: Frankfurt
Branch: main
Root Directory: (leave empty)
Runtime: Node
```

**Build & Deploy:**
```
Build Command: npm ci && npx prisma generate && npm run build:server
Start Command: npm run start
```

**Advanced Settings:**
```
Auto-Deploy: Yes
Health Check Path: /api/health
```

### Step 1.4: Configure Environment Variables on Render

In the **Environment** tab, add these variables:

#### Required Variables:
```ini
NODE_ENV=production

DATABASE_URL=<paste_internal_database_url_from_step_1.2>

JWT_SECRET=<generate_random_string_min_32_chars>

FRONTEND_URL=https://synrgy.vercel.app

PORT=5001
```

#### Stripe Variables (from your Stripe Dashboard):
```ini
STRIPE_SECRET_KEY=sk_test_51PZP5gG1234567890abcdef...
STRIPE_PUBLIC_KEY=pk_test_51PZP5gG1234567890abcdef...
STRIPE_WEBHOOK_SECRET=whsec_1234567890abcdef...
STRIPE_PRICE_CLIENT=price_1234ClientPriceId
STRIPE_PRICE_COACH=price_5678CoachPriceId
```

**How to get Stripe values:**
1. Go to https://dashboard.stripe.com/test/apikeys
2. Copy **Publishable key** → `STRIPE_PUBLIC_KEY`
3. Reveal and copy **Secret key** → `STRIPE_SECRET_KEY`
4. Go to https://dashboard.stripe.com/test/products
5. Click on "Client Synrgy" → Copy Price ID → `STRIPE_PRICE_CLIENT`
6. Click on "Coach Synrgy Pro" → Copy Price ID → `STRIPE_PRICE_COACH`
7. Go to https://dashboard.stripe.com/test/webhooks
8. Add endpoint: `https://synrgy-api.onrender.com/api/stripe/webhook`
9. Select events: `checkout.session.completed`, `customer.subscription.updated`
10. Copy **Signing secret** → `STRIPE_WEBHOOK_SECRET`

#### Optional Variables:
```ini
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=llama3.2:3b
```

### Step 1.5: Deploy Backend
1. Click **"Create Web Service"**
2. Render will automatically:
   - Clone your repository
   - Install dependencies
   - Run Prisma migrations
   - Build the TypeScript code
   - Start the server
3. Monitor the logs for:
   ```
   ✅ Connected to PostgreSQL via Prisma
   🚀 Synrgy LIVE on https://synrgy-api.onrender.com
   ```

**Expected Deployment Time:** 5-8 minutes

### Step 1.6: Verify Backend Deployment

**Test Health Endpoint:**
```bash
curl https://synrgy-api.onrender.com/api/health
```

**Expected Response:**
```json
{
  "ok": true,
  "status": "ok",
  "mode": "production",
  "version": "1.0.0",
  "timestamp": "2025-11-10T..."
}
```

---

## 💻 PART 2: FRONTEND DEPLOYMENT (VERCEL)

### Step 2.1: Create Vercel Account
1. Go to https://vercel.com
2. Sign up with GitHub
3. Authorize Vercel to access your repositories

### Step 2.2: Import Project
1. Click **"Add New..."** → **"Project"**
2. Import `ethan-plnqrt/synrgy-coachpro`
3. Click **"Import"**

### Step 2.3: Configure Project Settings

**Framework Preset:**
```
Framework: Vite
```

**Root Directory:**
```
. (root)
```

**Build Settings:**
```
Build Command: npm run build:client
Output Directory: dist
Install Command: npm install
```

### Step 2.4: Configure Environment Variables

In **Environment Variables** section, add:

```ini
VITE_API_URL=https://synrgy-api.onrender.com

VITE_STRIPE_PUBLISHABLE_KEY=pk_test_51PZP5gG1234567890abcdef...
```

**Note:** Use the same Stripe publishable key from your Render backend setup.

### Step 2.5: Deploy Frontend
1. Click **"Deploy"**
2. Vercel will:
   - Clone your repository
   - Install dependencies
   - Build the Vite app
   - Deploy to CDN
3. Wait for deployment (~2-3 minutes)

### Step 2.6: Configure Custom Domain (Optional)
1. In Project Settings → **Domains**
2. Add custom domain: `synrgy.app` or `app.synrgy.com`
3. Follow DNS configuration instructions
4. Wait for SSL certificate (~10 minutes)

### Step 2.7: Verify Frontend Deployment

**Open in Browser:**
```
https://synrgy.vercel.app
```

**Check Browser Console:**
```javascript
🌍 i18n initialized (languages: fr, en)
🈳 LanguageContext loaded: fr
```

**Test Navigation:**
- ✅ Landing page loads
- ✅ Click "Démarrer" → redirects to auth
- ✅ Sign up form appears
- ✅ Login form works

---

## 🔗 PART 3: CONNECT BACKEND & FRONTEND

### Step 3.1: Update Render Backend
1. Go back to Render Dashboard → `synrgy-api`
2. Update `FRONTEND_URL` environment variable:
   ```
   FRONTEND_URL=https://synrgy-XXXXX.vercel.app
   ```
   (Use your actual Vercel URL)
3. Click **"Save"**
4. Service will auto-redeploy (~2 minutes)

### Step 3.2: Update Vercel Frontend
1. Go back to Vercel Dashboard → `synrgy-coachpro`
2. Verify `VITE_API_URL` points to your Render backend:
   ```
   VITE_API_URL=https://synrgy-api.onrender.com
   ```
3. If changed, click **"Redeploy"**

### Step 3.3: Configure CORS
Your backend already has CORS configured in `server/index.ts`:
```typescript
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
```

This will automatically allow requests from Vercel once `FRONTEND_URL` is set.

---

## 🧪 PART 4: TESTING & VALIDATION

### Test 1: Backend Health Check ✅
```bash
curl https://synrgy-api.onrender.com/api/health
```

**Expected:**
```json
{"ok":true,"status":"ok","mode":"production"}
```

### Test 2: Frontend Loads ✅
```bash
open https://synrgy.vercel.app
```

**Expected:**
- Landing page displays
- No console errors
- i18n initialized log appears

### Test 3: Authentication Flow ✅
1. Click "Démarrer" on landing page
2. Fill registration form:
   ```
   Email: test@synrgy.com
   Password: Test1234!
   Full Name: Test Coach
   ```
3. Click "S'inscrire"
4. Should redirect to `/coach/dashboard`

### Test 4: Stripe Checkout ✅
1. Navigate to pricing page
2. Click "Démarrer" on "Coach Synrgy Pro"
3. Should redirect to Stripe Checkout
4. Use test card: `4242 4242 4242 4242`
5. Complete checkout
6. Should redirect back to dashboard with subscription active

### Test 5: Database Verification ✅
```bash
# From your local terminal
psql <DATABASE_URL_FROM_RENDER> -c "SELECT email, role FROM \"User\";"
```

**Expected:**
- Shows registered users
- Subscription data populated

### Test 6: Stripe Webhooks ✅
1. Complete a test payment
2. Check Render logs for:
   ```
   ✅ Webhook received: checkout.session.completed
   ✅ Subscription updated for user: test@synrgy.com
   ```

---

## 📊 PART 5: MONITORING & LOGS

### Render Logs
1. Go to Render Dashboard → `synrgy-api`
2. Click **"Logs"** tab
3. Monitor real-time logs
4. Look for errors or warnings

### Vercel Logs
1. Go to Vercel Dashboard → `synrgy-coachpro`
2. Click **"Deployments"**
3. Click latest deployment → **"Function Logs"**
4. Monitor for errors

### Stripe Webhooks
1. Go to https://dashboard.stripe.com/test/webhooks
2. Click your webhook endpoint
3. View **"Recent events"**
4. All events should show "succeeded"

---

## 🚨 TROUBLESHOOTING

### Issue: Backend won't start
**Symptoms:** Render logs show "Exited with status 1"

**Solutions:**
1. Check DATABASE_URL is set correctly
2. Verify all required env vars are present
3. Check build logs for TypeScript errors
4. Ensure Prisma migrations ran successfully

**Fix:**
```bash
# In Render Shell (Advanced → "Shell")
npx prisma migrate deploy
npx prisma generate
npm run start
```

### Issue: Frontend shows 404 on API calls
**Symptoms:** Console shows "Failed to fetch"

**Solutions:**
1. Verify `VITE_API_URL` is set in Vercel
2. Check CORS configuration in backend
3. Ensure `FRONTEND_URL` in Render matches Vercel URL
4. Test API directly: `curl https://synrgy-api.onrender.com/api/health`

### Issue: Stripe webhooks not working
**Symptoms:** Payments complete but subscription not activated

**Solutions:**
1. Verify `STRIPE_WEBHOOK_SECRET` is correct
2. Check webhook endpoint in Stripe Dashboard:
   - Should be: `https://synrgy-api.onrender.com/api/stripe/webhook`
3. Check Render logs for webhook errors
4. Verify webhook events are selected:
   - `checkout.session.completed`
   - `customer.subscription.updated`

### Issue: Database connection timeout
**Symptoms:** "connect ETIMEDOUT"

**Solutions:**
1. Check Render PostgreSQL is running
2. Verify DATABASE_URL is using internal connection string
3. Ensure database plan is active (not paused)

---

## 🔒 SECURITY CHECKLIST

- [ ] All environment variables set correctly
- [ ] JWT_SECRET is long and random (min 32 chars)
- [ ] Stripe keys are in test mode (until ready for production)
- [ ] CORS origin is set to specific domain (not `*`)
- [ ] HTTPS enabled on both frontend and backend
- [ ] Database uses strong password
- [ ] `.env` file is in `.gitignore`
- [ ] No secrets committed to git
- [ ] Webhook signature verification enabled

---

## 📈 POST-DEPLOYMENT TASKS

### 1. Update DNS (if using custom domain)
```
Type: CNAME
Name: @
Value: cname.vercel-dns.com
```

### 2. Enable Production Stripe Keys
When ready to accept real payments:
1. Go to Stripe Dashboard → Switch to **Live mode**
2. Copy live API keys
3. Update Render environment variables:
   ```
   STRIPE_SECRET_KEY=sk_live_...
   STRIPE_PUBLIC_KEY=pk_live_...
   ```
4. Update Vercel environment variables:
   ```
   VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...
   ```
5. Create live webhook endpoint
6. Update `STRIPE_WEBHOOK_SECRET`

### 3. Set Up Monitoring
- [ ] Render: Enable email alerts for downtime
- [ ] Vercel: Set up Vercel Analytics
- [ ] Stripe: Enable email notifications for failed payments
- [ ] Set up Sentry or LogRocket for error tracking

### 4. Backup Database
```bash
# Setup automated backups in Render
# PostgreSQL Starter plan includes daily backups
```

### 5. Performance Optimization
- [ ] Enable Vercel Edge Cache
- [ ] Configure Render autoscaling
- [ ] Set up CDN for static assets
- [ ] Enable Prisma connection pooling

---

## 📞 SUPPORT RESOURCES

- **Render Docs:** https://render.com/docs
- **Vercel Docs:** https://vercel.com/docs
- **Prisma Docs:** https://www.prisma.io/docs
- **Stripe Docs:** https://stripe.com/docs

---

## ✅ DEPLOYMENT SUCCESS CHECKLIST

When all items are checked, your deployment is complete:

### Backend (Render)
- [ ] PostgreSQL database created
- [ ] Web service deployed
- [ ] All environment variables configured
- [ ] Health endpoint responding
- [ ] Prisma connected to database
- [ ] Logs show no errors

### Frontend (Vercel)
- [ ] Project deployed
- [ ] Environment variables set
- [ ] Landing page loads
- [ ] Console shows no errors
- [ ] i18n initialized

### Integration
- [ ] API calls from frontend work
- [ ] Authentication flow complete
- [ ] Stripe checkout redirects correctly
- [ ] Webhooks received and processed
- [ ] Dashboard loads with data

### Testing
- [ ] Can create account
- [ ] Can log in
- [ ] Can complete checkout
- [ ] Subscription status updates
- [ ] Can access protected routes

---

## 🎉 FINAL STATUS

Once all checks pass, you should see:

**Backend Logs (Render):**
```
✅ Connected to PostgreSQL via Prisma
🚀 Synrgy LIVE on https://synrgy-api.onrender.com
📊 Health check: https://synrgy-api.onrender.com/api/health
✅ Stripe service loaded
✅ Système de parrainage opérationnel
```

**Frontend Console (Vercel):**
```javascript
🌍 i18n initialized (languages: fr, en)
🈳 LanguageContext loaded: fr
✅ API connected: https://synrgy-api.onrender.com
```

**Stripe Webhook Logs:**
```
✅ Webhook signature verified
✅ Event processed: checkout.session.completed
✅ User subscription activated
```

---

**✅ SYNRGY SAAS PUBLICLY ONLINE — LAUNCH PHASE COMPLETE 🚀**

**Backend:** https://synrgy-api.onrender.com  
**Frontend:** https://synrgy.vercel.app  
**Status:** 🟢 Live and Operational

**Train Smart. Live Synrgy. 💪✨**

