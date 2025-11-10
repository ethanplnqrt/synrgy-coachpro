#!/bin/bash
echo "🧪 Test minimal serveur..."
cd /Users/ethan.plnqrt/Downloads/CoachPro-Saas-main
NODE_ENV=development tsx server/index.ts 2>&1 | head -50
