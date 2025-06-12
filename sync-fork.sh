#!/bin/bash

echo "📦 Syncing your fork with the original repository..."

# Step 1: Add upstream (only if not already set)
if ! git remote get-url upstream &> /dev/null; then
  echo "🔗 Adding upstream..."
  git remote add upstream https://github.com/SandyaDesignerBoutique/sandyadesignerboutique.github.io
else
  echo "✅ Upstream remote already exists."
fi

# Step 2: Fetch from upstream
echo "⬇️  Fetching latest changes from upstream..."
git fetch upstream

# Step 3: Switch to your local main branch
echo "🔄 Checking out main branch..."
git checkout main

# Step 4: Merge changes from upstream/main
echo "🔀 Merging upstream/main into your local main..."
git merge upstream/main

# Step 5: Push to your fork
echo "🚀 Pushing updates to your fork (origin)..."
git push origin main

echo "✅ Sync complete!"
