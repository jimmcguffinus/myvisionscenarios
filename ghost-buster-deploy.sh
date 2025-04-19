#!/bin/bash

# Ghost Buster Deployment Script
# This script helps eliminate stubborn cached UIs by:
# 1. Creating a fresh preview channel
# 2. Building with unique timestamps
# 3. Deploying to both standard and /ghostbusters paths

echo "🚫👻 GHOST BUSTER DEPLOYMENT SCRIPT 👻🚫"
echo "----------------------------------------"

# Generate a unique channel name with timestamp
CHANNEL_NAME="ghost_buster_$(date +%Y%m%d_%H%M%S)"
echo "Creating new preview channel: $CHANNEL_NAME"

# Clean any previous builds
echo "Cleaning previous builds..."
rm -rf dist .firebase/hosting.*

# Run build
echo "Building project..."
npm ci
npm run build

# Create new preview channel
echo "Creating and deploying to new preview channel..."
firebase hosting:channel:create $CHANNEL_NAME
firebase hosting:channel:deploy $CHANNEL_NAME

# Regular deployment
echo "Deploying to main site..."
firebase deploy --only hosting

echo "----------------------------------------"
echo "🎯 DEPLOYMENT COMPLETE!"
echo ""
echo "🔗 Access the app at:"
echo "  Regular URL: https://myvisionscenarios.web.app/"
echo "  Ghostbusters URL: https://myvisionscenarios.web.app/ghostbusters/"
echo "  Preview Channel: https://myvisionscenarios--$CHANNEL_NAME.web.app/"
echo ""
echo "💡 For best results:"
echo "  - Use these URLs in incognito/private browsing mode"
echo "  - Add ?v=$(date +%s) to force version refresh"
echo "  - Try the preview channel URL first as it's completely fresh"
echo ""
echo "👻 If ghosts persist, try: firebase hosting:clone [PROJECT_ID]:$CHANNEL_NAME [PROJECT_ID]:live" 