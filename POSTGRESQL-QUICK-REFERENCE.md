# 🔍 PostgreSQL Quick Reference — Synrgy

**Last Updated:** November 10, 2025  
**Status:** 🟢 Active

---

## 📊 CONNECTION INFO

```ini
Database Name: synrgy
Host: localhost
Port: 5432
User: ethan.plnqrt
Schema: public

DATABASE_URL="postgresql://ethan.plnqrt@localhost:5432/synrgy?schema=public"
```

---

## 🚀 START/STOP

### Start PostgreSQL:
```bash
brew services start postgresql@16
```

### Stop PostgreSQL:
```bash
brew services stop postgresql@16
```

### Restart PostgreSQL:
```bash
brew services restart postgresql@16
```

### Check Status:
```bash
brew services list | grep postgresql
pg_isready
```

---

## 🛠️ DATABASE COMMANDS

### Connect to Database:
```bash
psql synrgy
```

### List All Databases:
```bash
psql -l
```

### List All Tables:
```bash
psql synrgy -c "\dt"
```

### View Table Schema:
```bash
psql synrgy -c "\d \"User\""
```

### View All Users:
```bash
psql synrgy -c "SELECT id, email, \"fullName\", role FROM \"User\";"
```

### Count Records:
```bash
psql synrgy -c "SELECT 
  (SELECT COUNT(*) FROM \"User\") as users,
  (SELECT COUNT(*) FROM \"Client\") as clients,
  (SELECT COUNT(*) FROM \"Program\") as programs;"
```

---

## 🔧 PRISMA COMMANDS

### Run Migrations:
```bash
npx prisma migrate deploy      # Production
npx prisma migrate dev         # Development (creates migration)
```

### Generate Client:
```bash
npx prisma generate
```

### Reset Database:
```bash
npx prisma migrate reset       # ⚠️ Deletes all data!
```

### Prisma Studio (GUI):
```bash
npx prisma studio              # Opens http://localhost:5555
```

### Check Migration Status:
```bash
npx prisma migrate status
```

### View Schema:
```bash
cat prisma/schema.prisma
```

---

## 📦 BACKUP & RESTORE

### Backup Database:
```bash
pg_dump synrgy > backup_$(date +%Y%m%d_%H%M%S).sql
```

### Restore Database:
```bash
psql synrgy < backup_20251110_081746.sql
```

### Backup with Compression:
```bash
pg_dump synrgy | gzip > backup_$(date +%Y%m%d).sql.gz
```

### Restore from Compressed:
```bash
gunzip -c backup_20251110.sql.gz | psql synrgy
```

---

## 🧪 TESTING

### Create Test User:
```sql
psql synrgy -c "
INSERT INTO \"User\" (id, email, password, \"fullName\", role)
VALUES (gen_random_uuid(), 'test@synrgy.com', 'hashed_password', 'Test User', 'coach');
"
```

### Delete Test Data:
```sql
psql synrgy -c "
DELETE FROM \"User\" WHERE email LIKE '%@test.com';
DELETE FROM \"Client\" WHERE email LIKE '%@test.com';
"
```

### View Recent Records:
```bash
psql synrgy -c "SELECT * FROM \"User\" ORDER BY \"createdAt\" DESC LIMIT 5;"
```

---

## 🔍 DEBUGGING

### Check Connection:
```bash
psql synrgy -c "SELECT version();"
```

### View Active Connections:
```bash
psql synrgy -c "SELECT * FROM pg_stat_activity WHERE datname = 'synrgy';"
```

### Kill Connection:
```bash
psql synrgy -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = 'synrgy' AND pid <> pg_backend_pid();"
```

### Check Table Sizes:
```bash
psql synrgy -c "
SELECT 
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
"
```

---

## 🚨 TROUBLESHOOTING

### Connection Refused:
```bash
# Check if PostgreSQL is running
brew services list | grep postgresql

# Start if stopped
brew services start postgresql@16

# Check port
lsof -i :5432
```

### "database does not exist":
```bash
createdb synrgy
```

### "role does not exist":
```bash
createuser $(whoami)
```

### Prisma Connection Issues:
```bash
# Verify .env
cat .env | grep DATABASE_URL

# Test connection
npx prisma db push
```

### Migration Conflicts:
```bash
# View status
npx prisma migrate status

# Resolve conflicts
npx prisma migrate resolve --applied 20251109190635_init_auth_system
```

---

## 📊 MONITORING

### Real-time Query Monitoring:
```bash
watch -n 2 'psql synrgy -c "SELECT COUNT(*) as total_users FROM \"User\";"'
```

### Server Health:
```bash
curl http://localhost:5001/api/health
```

### Check Logs:
```bash
tail -f /opt/homebrew/var/log/postgresql@16.log
```

---

## 🎯 COMMON TASKS

### Add New Column:
1. Edit `prisma/schema.prisma`
2. Run `npx prisma migrate dev --name add_new_column`
3. Run `npx prisma generate`

### Reset Development Database:
```bash
npx prisma migrate reset --force
npm run dev:server
```

### Export Data to JSON:
```bash
psql synrgy -c "SELECT row_to_json(t) FROM (SELECT * FROM \"User\") t;" > users.json
```

### Import from Production (Future):
```bash
# On production
pg_dump $DATABASE_URL > production_backup.sql

# On local
psql synrgy < production_backup.sql
```

---

## 🔒 SECURITY

### Change Local Password (if needed):
```bash
psql synrgy -c "ALTER USER ethan.plnqrt WITH PASSWORD 'new_password';"
```

### View User Permissions:
```bash
psql synrgy -c "\du"
```

### Grant All Privileges:
```bash
psql synrgy -c "GRANT ALL PRIVILEGES ON DATABASE synrgy TO ethan.plnqrt;"
```

---

## 📝 USEFUL QUERIES

### Find User by Email:
```sql
SELECT * FROM "User" WHERE email = 'coach@synrgy.com';
```

### Get All Coaches:
```sql
SELECT id, email, "fullName" FROM "User" WHERE role = 'coach';
```

### Count by Role:
```sql
SELECT role, COUNT(*) FROM "User" GROUP BY role;
```

### Recent Signups:
```sql
SELECT email, "createdAt" FROM "User" ORDER BY "createdAt" DESC LIMIT 10;
```

### Active Subscriptions:
```sql
SELECT 
  email, 
  "subscriptionPlan", 
  "subscriptionStatus"
FROM "User" 
WHERE "subscriptionStatus" = 'active';
```

---

## 🎨 PRETTY FORMATTING

### JSON Output:
```bash
psql synrgy -c "SELECT * FROM \"User\" LIMIT 1;" -t -A -F"," | jq -R -s -c 'split("\n") | .[1:-1]'
```

### Horizontal Display:
```bash
psql synrgy -c "\x" -c "SELECT * FROM \"User\" LIMIT 1;"
```

### CSV Export:
```bash
psql synrgy -c "COPY \"User\" TO STDOUT WITH CSV HEADER;" > users.csv
```

---

## ⚡ PERFORMANCE

### Analyze Tables:
```bash
psql synrgy -c "ANALYZE;"
```

### Vacuum Database:
```bash
psql synrgy -c "VACUUM FULL;"
```

### View Slow Queries:
```bash
psql synrgy -c "SELECT query, calls, mean_exec_time FROM pg_stat_statements ORDER BY mean_exec_time DESC LIMIT 10;"
```

---

## 🔗 USEFUL LINKS

- **PostgreSQL Docs:** https://www.postgresql.org/docs/16/
- **Prisma Docs:** https://www.prisma.io/docs/
- **Homebrew PostgreSQL:** https://formulae.brew.sh/formula/postgresql@16

---

## 📌 KEY FILES

```
/Users/ethan.plnqrt/Downloads/CoachPro-Saas-main/
├── .env                           # Database URL + secrets
├── prisma/
│   ├── schema.prisma              # Database schema
│   └── migrations/                # Migration history
├── server/
│   └── index.ts                   # Server entry point
└── POSTGRESQL-LOCAL-SETUP-SUCCESS.md  # Full setup guide
```

---

**✅ POSTGRESQL QUICK REFERENCE — READY**

**Database:** `synrgy`  
**Status:** 🟢 Active  
**User:** `ethan.plnqrt`

**For detailed setup information, see:** `POSTGRESQL-LOCAL-SETUP-SUCCESS.md`

