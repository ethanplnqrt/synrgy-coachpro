# 🔐 ENVIRONMENT VARIABLES REFERENCE

**Last Updated:** November 10, 2025  
**For:** Synrgy Production Deployment

---

## 📋 QUICK REFERENCE

### 🗄️ BACKEND (Render) - Required Variables

```ini
# === CORE ===
NODE_ENV=production
PORT=5001

# === DATABASE ===
DATABASE_URL=postgresql://synrgy_user:PASSWORD@HOST:5432/synrgydb?schema=public
# ↑ Copy from Render PostgreSQL Dashboard → "Internal Database URL"

# === SECURITY ===
JWT_SECRET=YOUR_RANDOM_32_CHAR_SECRET_HERE
# Generate with: openssl rand -base64 32

# === FRONTEND ===
FRONTEND_URL=https://synrgy.vercel.app
# ↑ Update with your actual Vercel URL after deployment

# === STRIPE (TEST MODE) ===
STRIPE_SECRET_KEY=sk_test_51PZP5gG1YourSecretKeyHere
STRIPE_PUBLIC_KEY=pk_test_51PZP5gG1YourPublicKeyHere
STRIPE_WEBHOOK_SECRET=whsec_YourWebhookSecretHere
STRIPE_PRICE_CLIENT=price_YourClientPriceIdHere
STRIPE_PRICE_COACH=price_YourCoachPriceIdHere

# === OPTIONAL (AI Features) ===
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=llama3.2:3b
```

---

### 💻 FRONTEND (Vercel) - Required Variables

```ini
# === API ===
VITE_API_URL=https://synrgy-api.onrender.com
# ↑ Update with your actual Render backend URL after deployment

# === STRIPE ===
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_51PZP5gG1YourPublicKeyHere
# ↑ Must match STRIPE_PUBLIC_KEY from backend
```

---

## 📝 DETAILED DESCRIPTIONS

### Backend Variables

#### `NODE_ENV`
- **Value:** `production`
- **Purpose:** Tells Express to run in production mode
- **Effects:**
  - Disables verbose logging
  - Enables performance optimizations
  - Activates security features

#### `PORT`
- **Value:** `5001` (or Render's default)
- **Purpose:** Port for Express server
- **Note:** Render may override this with its own PORT variable

#### `DATABASE_URL`
- **Format:** `postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public`
- **Source:** Render PostgreSQL Dashboard
- **How to Get:**
  1. Go to Render Dashboard
  2. Click on `synrgy-db` database
  3. Copy **"Internal Database URL"** (NOT External)
- **Example:** `postgresql://synrgy_user:abc123@dpg-xyz.frankfurt-postgres.render.com:5432/synrgydb?schema=public`

#### `JWT_SECRET`
- **Length:** Minimum 32 characters
- **Type:** Random alphanumeric string
- **Purpose:** Signs JWT tokens for authentication
- **Generate:**
  ```bash
  openssl rand -base64 32
  # Output: xK9mP4vL2nQ8rT5wY1zA3bC7dE6fG0hJ9iK2lM5nO8pQ=
  ```
- **⚠️ WARNING:** Never reuse between environments. Generate unique secret for production.

#### `FRONTEND_URL`
- **Value:** Your Vercel deployment URL
- **Purpose:** CORS origin whitelist
- **Initial Value:** `https://synrgy.vercel.app`
- **After Custom Domain:** `https://app.synrgy.com`
- **⚠️ IMPORTANT:** Must match exactly (no trailing slash)

#### `STRIPE_SECRET_KEY`
- **Format:** `sk_test_...` (test) or `sk_live_...` (production)
- **Source:** https://dashboard.stripe.com/test/apikeys
- **Purpose:** Server-side Stripe API authentication
- **Security:** Never expose in frontend code
- **Location in Stripe:**
  1. Stripe Dashboard → Developers → API keys
  2. Click "Reveal test key"
  3. Copy entire key

#### `STRIPE_PUBLIC_KEY`
- **Format:** `pk_test_...` (test) or `pk_live_...` (production)
- **Source:** https://dashboard.stripe.com/test/apikeys
- **Purpose:** Client-side Stripe initialization
- **Security:** Safe to expose (it's public)
- **Note:** Must match environment (test/live) of secret key

#### `STRIPE_WEBHOOK_SECRET`
- **Format:** `whsec_...`
- **Source:** https://dashboard.stripe.com/test/webhooks
- **Purpose:** Verify webhook signatures from Stripe
- **How to Get:**
  1. Go to Stripe Dashboard → Developers → Webhooks
  2. Click "Add endpoint"
  3. Enter URL: `https://synrgy-api.onrender.com/api/stripe/webhook`
  4. Select events:
     - `checkout.session.completed`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
  5. Click "Add endpoint"
  6. Copy "Signing secret"

#### `STRIPE_PRICE_CLIENT`
- **Format:** `price_...`
- **Source:** https://dashboard.stripe.com/test/products
- **Purpose:** Price ID for "Client Synrgy" plan (9.90€/month)
- **How to Get:**
  1. Go to Stripe Dashboard → Products
  2. Click on "Client Synrgy" product
  3. Find the price (9.90€/month)
  4. Click on the price → Copy "Price ID"
- **Example:** `price_1QDmeEG1c7BHN8Hx3TfGnqzV`

#### `STRIPE_PRICE_COACH`
- **Format:** `price_...`
- **Source:** https://dashboard.stripe.com/test/products
- **Purpose:** Price ID for "Coach Synrgy Pro" plan (29.90€/month)
- **How to Get:**
  1. Go to Stripe Dashboard → Products
  2. Click on "Coach Synrgy Pro" product
  3. Find the price (29.90€/month)
  4. Click on the price → Copy "Price ID"
- **Example:** `price_1QDmdpG1c7BHN8HxRvVqF6C1`

#### `OLLAMA_URL` (Optional)
- **Value:** `http://localhost:11434`
- **Purpose:** Local Ollama AI service endpoint
- **Note:** Won't work on Render unless running Ollama service separately
- **For Production:** Consider OpenAI API instead

#### `OLLAMA_MODEL` (Optional)
- **Value:** `llama3.2:3b`
- **Purpose:** Ollama model to use for AI features
- **Note:** Requires Ollama service running

---

### Frontend Variables

#### `VITE_API_URL`
- **Value:** Your Render backend URL
- **Purpose:** Base URL for all API requests
- **Initial Value:** `https://synrgy-api.onrender.com`
- **No Trailing Slash:** ❌ `https://synrgy-api.onrender.com/`
- **Correct:** ✅ `https://synrgy-api.onrender.com`

#### `VITE_STRIPE_PUBLISHABLE_KEY`
- **Value:** Same as `STRIPE_PUBLIC_KEY` from backend
- **Format:** `pk_test_...` (test) or `pk_live_...` (production)
- **Purpose:** Initialize Stripe in frontend
- **Must Match:** Backend environment (test/live)

---

## 🔄 SWITCHING TO PRODUCTION STRIPE

When ready to accept real payments:

### 1. Switch Stripe Dashboard to Live Mode
- Toggle "Test mode" to "Live mode" in top right

### 2. Get Live API Keys
```ini
# Backend (Render)
STRIPE_SECRET_KEY=sk_live_YourLiveSecretKey
STRIPE_PUBLIC_KEY=pk_live_YourLivePublicKey

# Frontend (Vercel)
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_YourLivePublicKey
```

### 3. Get Live Price IDs
- Navigate to Products in Live mode
- Copy new Price IDs:
```ini
STRIPE_PRICE_CLIENT=price_LiveClientPriceId
STRIPE_PRICE_COACH=price_LiveCoachPriceId
```

### 4. Create Live Webhook
- URL: `https://synrgy-api.onrender.com/api/stripe/webhook`
- Copy new signing secret:
```ini
STRIPE_WEBHOOK_SECRET=whsec_LiveWebhookSecret
```

### 5. Update Both Platforms
1. Render: Update all Stripe env vars
2. Vercel: Update `VITE_STRIPE_PUBLISHABLE_KEY`
3. Both services will auto-redeploy

---

## 📋 ENVIRONMENT VARIABLE CHECKLIST

### Before Deploying Backend (Render):
- [ ] `NODE_ENV=production`
- [ ] `DATABASE_URL` (from Render PostgreSQL)
- [ ] `JWT_SECRET` (generated with openssl)
- [ ] `FRONTEND_URL` (placeholder, update after Vercel)
- [ ] `STRIPE_SECRET_KEY` (from Stripe dashboard)
- [ ] `STRIPE_PUBLIC_KEY` (from Stripe dashboard)
- [ ] `STRIPE_WEBHOOK_SECRET` (create webhook first)
- [ ] `STRIPE_PRICE_CLIENT` (from products)
- [ ] `STRIPE_PRICE_COACH` (from products)

### Before Deploying Frontend (Vercel):
- [ ] `VITE_API_URL` (from Render deployment)
- [ ] `VITE_STRIPE_PUBLISHABLE_KEY` (matches backend)

### After Both Deployed:
- [ ] Update `FRONTEND_URL` in Render with actual Vercel URL
- [ ] Redeploy backend (automatic after env change)

---

## 🧪 TESTING ENV VARS

### Test Backend Connection:
```bash
# Health check
curl https://synrgy-api.onrender.com/api/health

# Check Stripe connection (returns products)
curl https://synrgy-api.onrender.com/api/stripe/products
```

### Test Frontend:
```javascript
// Open browser console on https://synrgy.vercel.app
console.log('API URL:', import.meta.env.VITE_API_URL);
console.log('Stripe Key:', import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

// Should see:
// API URL: https://synrgy-api.onrender.com
// Stripe Key: pk_test_...
```

---

## 🚨 COMMON MISTAKES

### ❌ Wrong DATABASE_URL
**Problem:** Using External Database URL instead of Internal  
**Symptom:** Connection timeouts  
**Solution:** Use Internal Database URL from Render

### ❌ Mismatched Stripe Keys
**Problem:** Test key in production, or live key in test  
**Symptom:** Stripe errors, failed payments  
**Solution:** Ensure all Stripe vars are from same mode (test/live)

### ❌ Wrong FRONTEND_URL
**Problem:** Trailing slash or missing https  
**Symptom:** CORS errors  
**Solution:** `https://synrgy.vercel.app` (no trailing slash)

### ❌ Missing VITE_ Prefix
**Problem:** Using `API_URL` instead of `VITE_API_URL`  
**Symptom:** Variable undefined in frontend  
**Solution:** All Vite env vars must start with `VITE_`

### ❌ Webhook URL Wrong
**Problem:** Using localhost or wrong domain  
**Symptom:** Webhooks never received  
**Solution:** Must be live URL: `https://synrgy-api.onrender.com/api/stripe/webhook`

---

## 📞 HELP & RESOURCES

### Generate JWT Secret:
```bash
openssl rand -base64 32
```

### Verify Stripe Webhook:
```bash
stripe listen --forward-to https://synrgy-api.onrender.com/api/stripe/webhook
```

### Test Database Connection:
```bash
psql "postgresql://USER:PASS@HOST:5432/DATABASE" -c "SELECT version();"
```

---

## ✅ FINAL VERIFICATION

All environment variables correctly set when you see:

**Backend Logs:**
```
✅ Fichier .env chargé
✅ Clés Stripe détectées
✅ Connected to PostgreSQL via Prisma
🚀 Synrgy LIVE on https://synrgy-api.onrender.com
```

**Frontend Console:**
```javascript
🌍 i18n initialized
🈳 LanguageContext loaded: fr
✅ API URL configured
✅ Stripe initialized
```

**No Errors:**
- No CORS errors
- No "undefined" env vars
- No Stripe authentication errors
- No database connection errors

---

**✅ ENVIRONMENT VARIABLES REFERENCE COMPLETE**

**For deployment guide, see:** `DEPLOY-TO-PRODUCTION.md`

**Train Smart. Live Synrgy. 💪✨**

