#!/bin/bash

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}=== Configuration automatique Stripe pour Synrgy ===${NC}\n"

ENV_FILE=".env"
ENV_EXAMPLE=".env.example"

# Create .env from .env.example if it doesn't exist
if [ ! -f "$ENV_FILE" ]; then
    if [ -f "$ENV_EXAMPLE" ]; then
        cp "$ENV_EXAMPLE" "$ENV_FILE"
        echo -e "${GREEN}✓ Fichier .env créé depuis .env.example${NC}\n"
    else
        touch "$ENV_FILE"
        echo -e "${GREEN}✓ Fichier .env créé${NC}\n"
    fi
fi

# Backup existing .env
cp "$ENV_FILE" "${ENV_FILE}.backup"
echo -e "${BLUE}Sauvegarde créée: .env.backup${NC}\n"

# Function to update or add env variable
update_env_var() {
    local key=$1
    local value=$2
    
    if grep -q "^${key}=" "$ENV_FILE"; then
        # Update existing
        sed -i.tmp "s|^${key}=.*|${key}=${value}|" "$ENV_FILE"
        echo -e "${GREEN}✓ ${key} mis à jour${NC}"
    else
        # Add new
        echo "${key}=${value}" >> "$ENV_FILE"
        echo -e "${GREEN}✓ ${key} ajouté${NC}"
    fi
}

echo -e "${BLUE}Mise à jour des variables Stripe...${NC}\n"

# Stripe Keys
update_env_var "STRIPE_WEBHOOK_SECRET" "whsec_9eb3b48f66c9530a793f517790a34fff2fcd3c231401810148bd57658b11e7e4"

# Price IDs
update_env_var "STRIPE_PRICE_COACH" "price_prod_TLfYI0nWTUy543"
update_env_var "STRIPE_PRICE_CLIENT" "price_prod_TLfZ1muRLwGmQC"
update_env_var "STRIPE_PRICE_ATHLETE" "price_prod_TLfZhpICUVh8Qs"

# Other configs
update_env_var "APP_BASE_URL" "http://localhost:5001"
update_env_var "FRONTEND_URL" "http://localhost:5173"
update_env_var "NODE_ENV" "development"

# Clean up temp file
rm -f .env.tmp

echo -e "\n${BLUE}==================================${NC}"
echo -e "${GREEN}✅ Configuration Stripe terminée !${NC}"
echo -e "${BLUE}==================================${NC}\n"

echo -e "${YELLOW}Variables Stripe configurées:${NC}"
echo "  • STRIPE_PUBLIC_KEY"
echo "  • STRIPE_SECRET_KEY"
echo "  • STRIPE_WEBHOOK_SECRET"
echo "  • STRIPE_PRICE_COACH (49€/mois)"
echo "  • STRIPE_PRICE_CLIENT (29€/mois)"
echo "  • STRIPE_PRICE_ATHLETE (19€/mois)"
echo "  • APP_BASE_URL"
echo "  • FRONTEND_URL"
echo ""

echo -e "${YELLOW}Prochaines étapes:${NC}"
echo -e "  1. Lancer le backend:"
echo -e "     ${BLUE}npm run dev:server${NC}"
echo ""
echo -e "  2. Vérifier les logs de démarrage:"
echo -e "     ${GREEN}✅ Stripe connecté (mode test)${NC}"
echo -e "     ${GREEN}✅ Webhook actif${NC}"
echo ""
echo -e "  3. Lancer le frontend:"
echo -e "     ${BLUE}npm run dev:client${NC}"
echo ""
echo -e "  4. Tester un paiement:"
echo -e "     http://localhost:5173/pricing"
echo ""

echo -e "${GREEN}Configuration terminée ! 🎉${NC}\n"

