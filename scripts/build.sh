#!/bin/bash

set -e  # exit on any failure

echo "🧼 Cleaning workspace..."

# Remove node_modules and dist
rm -rf node_modules
rm -rf dist

# Always regenerate package.json
echo "🛠 Regenerating package.json..."
rm -f package.json
node scripts/manifest/build-manifest.js

# Install dependencies
if [ -f "package-lock.json" ]; then
  echo "📦 Installing dependencies with npm ci..."
  npm ci
else
  echo "📦 Installing dependencies with npm install..."
  npm install
fi

# Compile
echo "🔧 Compiling extension..."
npm run compile
