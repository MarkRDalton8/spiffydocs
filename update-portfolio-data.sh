#!/bin/bash
# Update Portfolio Dashboard
# Complete workflow: Generate report → Copy JSON → Commit → Deploy

set -e  # Exit on any error

CLI_DIR="/Users/markdalton/code/spiffy-cli"
WEB_DIR="/Users/markdalton/code/spiffydocs"
CLI_JSON="$CLI_DIR/data/reports/portfolio_report_latest.json"
WEB_JSON="$WEB_DIR/public/data/portfolio_report_latest.json"

echo "🚀 Portfolio Dashboard Update Workflow"
echo "========================================"
echo ""

# Step 1: Generate latest portfolio report
echo "📊 Step 1/3: Generating portfolio report..."
cd "$CLI_DIR"
python3 portfolio_report_generator.py

if [ ! -f "$CLI_JSON" ]; then
    echo "❌ Error: Portfolio report generation failed"
    exit 1
fi

echo "✅ Report generated successfully"
echo ""

# Step 2: Copy JSON to web app
echo "📦 Step 2/3: Copying data to web app..."
cp "$CLI_JSON" "$WEB_JSON"

if [ $? -ne 0 ]; then
    echo "❌ Error: Failed to copy JSON file"
    exit 1
fi

echo "✅ Data copied to $WEB_JSON"
echo ""

# Step 3: Commit and push
echo "🔄 Step 3/3: Committing and deploying..."
cd "$WEB_DIR"

# Check if there are changes
if git diff --quiet public/data/portfolio_report_latest.json; then
    echo "ℹ️  No changes detected in portfolio data"
    echo "   Dashboard is already up to date"
    exit 0
fi

# Show what changed
echo ""
echo "Changes detected:"
git diff --stat public/data/portfolio_report_latest.json

# Commit and push
git add public/data/portfolio_report_latest.json
git commit -m "Update portfolio data - $(date '+%Y-%m-%d %H:%M')

Auto-generated portfolio report update

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"

git push origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Portfolio dashboard update complete!"
    echo ""
    echo "📈 Summary:"
    echo "   • Report generated from Salesforce"
    echo "   • Data copied to web app"
    echo "   • Changes committed and pushed"
    echo "   • Vercel deploying now (~60 seconds)"
    echo ""
    echo "🌐 Dashboard: https://spiffydocs.ai/dashboard"
else
    echo "❌ Error: Git push failed"
    exit 1
fi
