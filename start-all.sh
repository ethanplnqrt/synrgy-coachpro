#!/usr/bin/env bash

# SHIELD v10.0 - Start All Script
echo "🛡️ Starting SHIELD v10.0..."

# Kill any existing processes
pkill -f "node.*server" 2>/dev/null || true
pkill -f "vite.*client" 2>/dev/null || true

# Set environment
export NODE_ENV=development

# Start both services
echo "🚀 Starting server and client..."
npm run dev:all
