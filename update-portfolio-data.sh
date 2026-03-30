#!/bin/bash
# Update Portfolio Data
# Copy latest portfolio JSON from CLI to web app public directory

CLI_PATH="/Users/markdalton/code/spiffy-cli/data/reports/portfolio_report_latest.json"
WEB_PATH="/Users/markdalton/code/spiffydocs/public/data/portfolio_report_latest.json"

echo "📊 Updating portfolio dashboard data..."

if [ ! -f "$CLI_PATH" ]; then
    echo "❌ Error: Portfolio report not found at $CLI_PATH"
    echo "   Run: cd spiffy-cli && python3 portfolio_report_generator.py"
    exit 1
fi

cp "$CLI_PATH" "$WEB_PATH"

if [ $? -eq 0 ]; then
    echo "✅ Portfolio data updated successfully!"
    echo "   From: $CLI_PATH"
    echo "   To: $WEB_PATH"
    echo ""
    echo "Next steps:"
    echo "  1. Review changes: git diff public/data/portfolio_report_latest.json"
    echo "  2. Commit and push: git add public/data && git commit -m 'Update portfolio data' && git push"
    echo "  3. Vercel will auto-deploy with new data"
else
    echo "❌ Error copying file"
    exit 1
fi
