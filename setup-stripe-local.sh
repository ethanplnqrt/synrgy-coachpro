#!/bin/bash

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}=== Configuration Stripe CLI pour Synrgy ===${NC}\n"

# Check if Stripe CLI is installed
if ! command -v stripe &> /dev/null; then
    echo -e "${RED}❌ Stripe CLI n'est pas installé${NC}"
    echo -e "${YELLOW}Installation:${NC}"
    echo "  macOS: brew install stripe/stripe-cli/stripe"
    echo "  Autres: https://stripe.com/docs/stripe-cli"
    exit 1
fi

echo -e "${GREEN}✓ Stripe CLI détecté${NC}\n"

# Check if logged in
if ! stripe config --list &> /dev/null; then
    echo -e "${YELLOW}⚠️  Vous n'êtes pas connecté à Stripe${NC}"
    echo -e "${BLUE}Lancement de la connexion...${NC}\n"
    stripe login
fi

echo -e "${GREEN}✓ Connecté à Stripe${NC}\n"

# Check if backend is running
echo -e "${BLUE}Vérification du backend sur localhost:5001...${NC}"
if curl -s http://localhost:5001/api/health &> /dev/null; then
    echo -e "${GREEN}✓ Backend Synrgy détecté sur :5001${NC}\n"
else
    echo -e "${RED}❌ Backend non détecté sur :5001${NC}"
    echo -e "${YELLOW}Lancez d'abord: npm run dev:server${NC}\n"
    exit 1
fi

# Start Stripe listen and capture webhook secret
echo -e "${BLUE}Démarrage du tunnel Stripe CLI...${NC}\n"
echo -e "${YELLOW}📡 Forwarding webhooks: Stripe → localhost:5001/api/payments/webhook${NC}\n"

# Launch stripe listen and capture the webhook secret
stripe listen --forward-to localhost:5001/api/payments/webhook > /tmp/stripe-listen.log 2>&1 &
STRIPE_PID=$!

# Wait for the webhook secret to appear
echo -e "${BLUE}Attente de la clé webhook...${NC}"
sleep 3

# Extract webhook secret from output
WEBHOOK_SECRET=""
for i in {1..10}; do
    if [ -f /tmp/stripe-listen.log ]; then
        WEBHOOK_SECRET=$(grep -o "whsec_[a-zA-Z0-9]*" /tmp/stripe-listen.log | head -1)
        if [ -n "$WEBHOOK_SECRET" ]; then
            break
        fi
    fi
    sleep 1
done

if [ -z "$WEBHOOK_SECRET" ]; then
    echo -e "${RED}❌ Impossible de récupérer la clé webhook${NC}"
    echo -e "${YELLOW}Vérifiez /tmp/stripe-listen.log pour plus de détails${NC}"
    kill $STRIPE_PID 2>/dev/null
    exit 1
fi

echo -e "${GREEN}✓ Clé webhook récupérée: ${WEBHOOK_SECRET}${NC}\n"

# Update .env file
echo -e "${BLUE}Mise à jour du fichier .env...${NC}"

ENV_FILE=".env"

# Create .env if it doesn't exist
if [ ! -f "$ENV_FILE" ]; then
    cp .env.example "$ENV_FILE"
    echo -e "${GREEN}✓ Fichier .env créé depuis .env.example${NC}"
fi

# Check if STRIPE_WEBHOOK_SECRET already exists
if grep -q "^STRIPE_WEBHOOK_SECRET=" "$ENV_FILE"; then
    # Replace existing value
    sed -i.bak "s|^STRIPE_WEBHOOK_SECRET=.*|STRIPE_WEBHOOK_SECRET=$WEBHOOK_SECRET|" "$ENV_FILE"
    echo -e "${GREEN}✓ STRIPE_WEBHOOK_SECRET mis à jour dans .env${NC}\n"
else
    # Add new line
    echo "" >> "$ENV_FILE"
    echo "# Stripe Webhook Secret (local tunnel)" >> "$ENV_FILE"
    echo "STRIPE_WEBHOOK_SECRET=$WEBHOOK_SECRET" >> "$ENV_FILE"
    echo -e "${GREEN}✓ STRIPE_WEBHOOK_SECRET ajouté dans .env${NC}\n"
fi

# Clean up backup file
rm -f .env.bak

echo -e "${BLUE}==================================${NC}"
echo -e "${GREEN}✅ Configuration Stripe CLI terminée !${NC}"
echo -e "${BLUE}==================================${NC}\n"

echo -e "${YELLOW}Informations:${NC}"
echo -e "  • Tunnel actif: Stripe → localhost:5001/api/payments/webhook"
echo -e "  • Webhook secret: ${WEBHOOK_SECRET}"
echo -e "  • PID: ${STRIPE_PID}"
echo -e "\n${YELLOW}Prochaines étapes:${NC}"
echo -e "  1. Redémarrer le serveur pour charger la nouvelle clé:"
echo -e "     ${BLUE}npm run dev:server${NC}"
echo -e "\n  2. Tester un événement Stripe:"
echo -e "     ${BLUE}stripe trigger checkout.session.completed${NC}"
echo -e "\n${RED}⚠️  NE PAS FERMER CE TERMINAL${NC}"
echo -e "Le tunnel Stripe CLI doit rester actif pour recevoir les webhooks.\n"

# Show live webhook events
echo -e "${BLUE}Affichage des événements en temps réel...${NC}\n"
tail -f /tmp/stripe-listen.log

