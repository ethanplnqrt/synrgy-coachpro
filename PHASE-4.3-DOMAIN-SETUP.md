# 🌍 Phase 4.3 - Configuration Domaine & HTTPS

## 📋 Configuration DNS (synrgy.coach)

### Étape 1 : Configurer les enregistrements DNS

**Chez votre registrar (GoDaddy, Namecheap, OVH, etc.) :**

#### A Record (domaine racine)
```
Type: A
Name: @
Value: 76.76.21.21
TTL: 3600 (1 heure)
```

#### CNAME Record (www)
```
Type: CNAME  
Name: www
Value: cname.vercel-dns.com
TTL: 3600 (1 heure)
```

### Étape 2 : Ajouter le domaine sur Vercel

1. Va sur [vercel.com/dashboard](https://vercel.com/dashboard)
2. Sélectionne le projet **Synrgy**
3. Clique sur **Settings → Domains**
4. Ajoute le domaine : `synrgy.coach`
5. Ajoute également : `www.synrgy.coach`
6. Vercel vérifiera automatiquement les DNS

### Étape 3 : Attendre la propagation DNS

```bash
# Vérifier la propagation DNS (peut prendre 2-48h)
nslookup synrgy.coach
dig synrgy.coach

# Doit retourner l'IP Vercel : 76.76.21.21
```

### Étape 4 : Vérifier HTTPS

```bash
# Test SSL
curl -I https://synrgy.coach

# Doit retourner :
# HTTP/2 200
# ... certificat Let's Encrypt valide
```

---

## ⚙️ Configuration Backend Render

### Mise à jour de FRONTEND_URL

1. Va sur [render.com/dashboard](https://render.com/dashboard)
2. Sélectionne le service **Synrgy API**
3. Clique sur **Environment**
4. Modifie (ou ajoute) la variable :

```env
FRONTEND_URL=https://synrgy.coach
```

5. Clique sur **Save Changes**
6. Render redémarrera automatiquement

### Vérification CORS

Le fichier `server/middleware/security.ts` accepte déjà plusieurs origines.

Avec `FRONTEND_URL=https://synrgy.coach`, le backend autorisera :
- ✅ `https://synrgy.coach`
- ✅ `https://synrgy-api.onrender.com`
- ✅ `http://localhost:5173` (dev)

---

## 🩺 Monitoring Uptime (éviter cold starts)

### Option 1 : Cron-job.org (Gratuit)

1. Va sur [cron-job.org](https://cron-job.org)
2. Créer un compte gratuit
3. Ajouter un cron job :
   - **URL** : `https://synrgy-api.onrender.com/api/health`
   - **Intervalle** : Tous les 15 minutes
   - **Méthode** : GET
   - **Timeout** : 30 secondes

### Option 2 : UptimeRobot (Gratuit)

1. Va sur [uptimerobot.com](https://uptimerobot.com)
2. Créer un compte gratuit
3. Ajouter un monitor :
   - **Type** : HTTP(s)
   - **URL** : `https://synrgy-api.onrender.com/api/health`
   - **Intervalle** : 5 minutes (plan gratuit)

### Option 3 : Script local (développement)

```bash
# Démarrer le monitoring local
npm run monitor:uptime

# Output:
# 🩺 Synrgy Uptime Monitor started
# 📡 Pinging: https://synrgy-api.onrender.com/api/health
# ⏱️  Interval: Every 15 minutes
# ✅ [timestamp] API is alive (200)
```

---

## ✅ Checklist de vérification

- [ ] DNS A record configuré (@ → 76.76.21.21)
- [ ] DNS CNAME configuré (www → cname.vercel-dns.com)  
- [ ] Domaine ajouté sur Vercel
- [ ] HTTPS actif (certificat Let's Encrypt)
- [ ] Redirection www → root fonctionne
- [ ] `FRONTEND_URL` mis à jour sur Render
- [ ] Monitoring uptime configuré (cron-job.org ou UptimeRobot)
- [ ] Test : `curl -I https://synrgy.coach` → 200 OK

---

## 🔗 URLs finales

| Service | URL |
|---------|-----|
| **Frontend Production** | https://synrgy.coach |
| **Frontend www** | https://www.synrgy.coach → redirige vers synrgy.coach |
| **Backend API** | https://synrgy-api.onrender.com |
| **Preview Mode** | https://synrgy.coach/preview |
| **Pricing** | https://synrgy.coach/pricing |

---

## 🎯 Commandes de test

```bash
# Test domaine principal
curl -I https://synrgy.coach
# → HTTP/2 200

# Test redirection www
curl -I https://www.synrgy.coach
# → HTTP/2 301 (redirect to https://synrgy.coach)

# Test API depuis frontend
curl -I https://synrgy.coach/api/health
# → Proxifié vers Render, retourne 200

# Test backend direct
curl -I https://synrgy-api.onrender.com/api/health
# → HTTP/2 200
```

---

## 📊 Temps de propagation

- **DNS** : 2-48 heures (généralement < 6h)
- **Certificat SSL** : Automatique (quelques minutes après DNS validé)
- **Redirection www** : Immédiat après déploiement Vercel
- **CORS Render** : Immédiat après redémarrage service

---

## 🚨 Troubleshooting

### Problème : DNS ne propage pas

```bash
# Vérifier les DNS
dig synrgy.coach +short
# Doit retourner : 76.76.21.21

# Flush DNS local
sudo dscacheutil -flushcache (macOS)
ipconfig /flushdns (Windows)
```

### Problème : CORS bloque les requêtes

**Erreur console :**
```
Access to fetch at 'https://synrgy-api.onrender.com/api/...' from origin 'https://synrgy.coach' has been blocked by CORS policy
```

**Solution :**
Vérifier que `FRONTEND_URL=https://synrgy.coach` est bien défini sur Render et que le service a redémarré.

### Problème : Cold start Render (500-1000ms)

**Solution :**
Activer le monitoring uptime avec cron-job.org ou UptimeRobot (gratuit).

---

## ✅ Statut final attendu

Après configuration complète :
- ✅ https://synrgy.coach accessible (HTTPS)
- ✅ www redirige vers root
- ✅ API fonctionnelle depuis le frontend
- ✅ Pas d'erreurs CORS
- ✅ Cold starts minimisés (monitoring actif)
- ✅ Certificat SSL valide (Let's Encrypt)

