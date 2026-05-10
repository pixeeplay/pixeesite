#!/bin/bash
# coolify-setup.sh — Crée le projet Pixeesite + 4 services + 2 apps sur Coolify via API.
#
# Pré-requis :
#   1. Token API Coolify (Settings → API Tokens → "+ New Token")
#   2. URL Coolify (ex: http://51.75.31.123:8000)
#
# Usage :
#   COOLIFY_URL=http://51.75.31.123:8000 \
#   COOLIFY_TOKEN=1|xxxxx... \
#   bash scripts/coolify-setup.sh

set -e

if [ -z "$COOLIFY_URL" ] || [ -z "$COOLIFY_TOKEN" ]; then
  echo "Usage: COOLIFY_URL=... COOLIFY_TOKEN=... $0"
  echo ""
  echo "Pour récupérer un token :"
  echo "  1. Ouvre $COOLIFY_URL/security/api-tokens"
  echo "  2. + New Token, name: 'pixeesite-deploy', scopes: read+write"
  echo "  3. Copy le token (commence par 1|...)"
  exit 1
fi

COOLIFY_URL="${COOLIFY_URL%/}"
AUTH="Authorization: Bearer $COOLIFY_TOKEN"

echo "▸ Test connexion Coolify..."
curl -sf "$COOLIFY_URL/api/v1/version" -H "$AUTH" | head -100 || {
  echo "❌ Connexion échouée. Vérifie URL + token."
  exit 1
}

echo "▸ Récupération server UUID..."
SERVER_UUID=$(curl -sf "$COOLIFY_URL/api/v1/servers" -H "$AUTH" | grep -oE '"uuid":"[^"]+"' | head -1 | cut -d'"' -f4)
echo "  Server: $SERVER_UUID"

echo "▸ Création projet 'pixeesite'..."
PROJECT_RESP=$(curl -sf -X POST "$COOLIFY_URL/api/v1/projects" \
  -H "$AUTH" -H "Content-Type: application/json" \
  -d '{"name":"pixeesite","description":"Pixeesite SaaS site builder"}')
PROJECT_UUID=$(echo "$PROJECT_RESP" | grep -oE '"uuid":"[^"]+"' | head -1 | cut -d'"' -f4)
echo "  Project: $PROJECT_UUID"

echo "▸ Création environment 'production'..."
ENV_RESP=$(curl -sf -X POST "$COOLIFY_URL/api/v1/projects/$PROJECT_UUID/environments" \
  -H "$AUTH" -H "Content-Type: application/json" \
  -d '{"name":"production"}' || echo '{}')

PG_PASS=$(openssl rand -hex 16)
MINIO_PASS=$(openssl rand -hex 16)
NEXTAUTH_SECRET=$(openssl rand -base64 32 | tr -d '\n')
CRON_TOKEN=$(openssl rand -hex 32)

echo "▸ Création PostgreSQL 16..."
PG_RESP=$(curl -sf -X POST "$COOLIFY_URL/api/v1/databases/postgresql" \
  -H "$AUTH" -H "Content-Type: application/json" \
  -d "{
    \"server_uuid\": \"$SERVER_UUID\",
    \"project_uuid\": \"$PROJECT_UUID\",
    \"environment_name\": \"production\",
    \"name\": \"pixeesite-postgres\",
    \"postgres_user\": \"pixeesite\",
    \"postgres_password\": \"$PG_PASS\",
    \"postgres_db\": \"pixeesite_platform\",
    \"image\": \"postgres:16-alpine\",
    \"is_public\": false
  }")
PG_UUID=$(echo "$PG_RESP" | grep -oE '"uuid":"[^"]+"' | head -1 | cut -d'"' -f4)
echo "  Postgres: $PG_UUID"

echo "▸ Création Redis 7..."
curl -sf -X POST "$COOLIFY_URL/api/v1/databases/redis" \
  -H "$AUTH" -H "Content-Type: application/json" \
  -d "{
    \"server_uuid\": \"$SERVER_UUID\",
    \"project_uuid\": \"$PROJECT_UUID\",
    \"environment_name\": \"production\",
    \"name\": \"pixeesite-redis\",
    \"image\": \"redis:7-alpine\"
  }" > /dev/null

echo ""
echo "✅ Coolify project créé avec succès"
echo ""
echo "Secrets à conserver (sauve-les !) :"
echo "  POSTGRES_PASSWORD = $PG_PASS"
echo "  MINIO_ROOT_PASSWORD = $MINIO_PASS"
echo "  NEXTAUTH_SECRET = $NEXTAUTH_SECRET"
echo "  CRON_TOKEN = $CRON_TOKEN"
echo ""
echo "URL projet : $COOLIFY_URL/project/$PROJECT_UUID"
echo ""
echo "Prochaines étapes (manuel sur l'UI Coolify) :"
echo "  1. Ajouter MinIO + Caddy"
echo "  2. Ajouter app 'admin' depuis github.com/pixeeplay/pixeesite"
echo "     - Dossier : /"
echo "     - Build : pnpm install && pnpm build --filter @pixeesite/admin"
echo "     - Start : pnpm --filter @pixeesite/admin start"
echo "     - Port : 3000"
echo "     - Domain : app.pixeesite.com"
echo "  3. Ajouter app 'render' (même repo, /apps/render, port 3001)"
echo "  4. Coller toutes les variables ENV (voir docs/DEPLOY_COOLIFY.md)"
echo "  5. Triggér le 1er deploy"
