#!/bin/bash

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}=== Configuration .env pour Synrgy ===${NC}\n"

ENV_FILE=".env"

# Create .env from example if it doesn't exist
if [ ! -f "$ENV_FILE" ]; then
    echo -e "${YELLOW}Création du fichier .env...${NC}"
    if [ -f ".env.example" ]; then
        cp .env.example "$ENV_FILE"
        echo -e "${GREEN}✓ .env créé depuis .env.example${NC}\n"
    else
        touch "$ENV_FILE"
        echo -e "${GREEN}✓ .env créé${NC}\n"
    fi
fi

# Function to update or add env variable
update_env_var() {
    local KEY=$1
    local VALUE=$2
    
    if grep -q "^${KEY}=" "$ENV_FILE"; then
        # Update existing
        sed -i.bak "s|^${KEY}=.*|${KEY}=${VALUE}|" "$ENV_FILE"
        echo -e "${GREEN}✓ ${KEY} mis à jour${NC}"
    else
        # Add new
        echo "${KEY}=${VALUE}" >> "$ENV_FILE"
        echo -e "${GREEN}✓ ${KEY} ajouté${NC}"
    fi
}

echo -e "${BLUE}Configuration des clés Stripe...${NC}\n"

# Stripe Keys
update_env_var "STRIPE_PUBLIC_KEY" "pk_test_51SOw9eJlyCE49zWsWQzcVIsHXiBzTpAeMU5XPbQXLQknrFAsW54PJ4A20FMRU7sceBsPawp9k1NwOaUjyeq6Y0w300uFUu3fzI"
update_env_var "STRIPE_SECRET_KEY" "sk_test_51SOw9eJlyCE49zWsV3mo2lO0hjAHh1GuTpHJ90GZOWfdzRaDYr0O5C0zrZTlAkVtNnv1tbL0GNDQ0Y6mD4CogpB300QHdFK4DT"
update_env_var "STRIPE_WEBHOOK_SECRET" "whsec_9eb3b48f66c9530a793f517790a34fff2fcd3c231401810148bd57658b11e7e4"

echo ""
echo -e "${BLUE}Configuration des Price IDs (3 formules)...${NC}\n"

update_env_var "STRIPE_PRICE_COACH" "price_prod_TLfYI0nWTUy543"
update_env_var "STRIPE_PRICE_CLIENT" "price_prod_TLfZ1muRLwGmQC"
update_env_var "STRIPE_PRICE_ATHLETE" "price_prod_TLfZhpICUVh8Qs"

echo ""
echo -e "${BLUE}Configuration des URLs...${NC}\n"

update_env_var "APP_BASE_URL" "http://localhost:5001"
update_env_var "FRONTEND_URL" "http://localhost:5173"
update_env_var "NODE_ENV" "development"

# Clean up backup files
rm -f .env.bak

echo ""
echo -e "${BLUE}==================================${NC}"
echo -e "${GREEN}✅ Configuration .env terminée !${NC}"
echo -e "${BLUE}==================================${NC}\n"

echo -e "${YELLOW}Variables Stripe configurées:${NC}"
echo "  ✓ STRIPE_PUBLIC_KEY"
echo "  ✓ STRIPE_SECRET_KEY"
echo "  ✓ STRIPE_WEBHOOK_SECRET"
echo "  ✓ STRIPE_PRICE_COACH"
echo "  ✓ STRIPE_PRICE_CLIENT"
echo "  ✓ STRIPE_PRICE_ATHLETE"

echo ""
echo -e "${YELLOW}Prochaines étapes:${NC}"
echo -e "  1. Lancer le serveur:"
echo -e "     ${BLUE}npm run dev:server${NC}"
echo ""
echo -e "  2. Le serveur affichera:"
echo -e "     ${GREEN}✅ Stripe connecté (mode test)${NC}"
echo -e "     ${GREEN}✅ Webhook actif${NC}"
echo -e "     ${GREEN}✅ Synrgy live on http://localhost:5001${NC}"
echo ""
echo -e "  3. Tester un paiement:"
echo -e "     http://localhost:5173/pricing"
echo ""

