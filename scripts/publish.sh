#!/bin/bash

if [ ! -f "./package.json" ]; then
  echo "🛠  Generating package.json from base manifest..."
  node scripts/manifest/build-manifest.js
fi

npm run publish
