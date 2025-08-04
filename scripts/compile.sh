#!/bin/bash

# Always regenerate package.json
echo "🛠 Regenerating package.json"
rm -f package.json
node scripts/manifest/build-manifest.js

npm run compile
