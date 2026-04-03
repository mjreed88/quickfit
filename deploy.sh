#!/bin/bash
# QuickFit AWS S3 + CloudFront Deployment Script
# Usage: ./deploy.sh

set -e

BUCKET="s3://quickfit-mjreed88"
DISTRIBUTION_ID="E36MXEDXKGKVQX"
REGION="us-east-1"

echo "🚀 Deploying QuickFit to AWS..."

# 1. Build
echo "📦 Building..."
npm run build

# 2. Upload to S3
echo "☁️  Uploading to S3..."
aws s3 sync dist/ "$BUCKET/" --delete --region $REGION

# 3. Create invalidation (force CloudFront refresh)
echo "🔄 Invalidating CloudFront cache..."
aws cloudfront create-invalidation --distribution-id $DISTRIBUTION_ID --paths "/*" --region $REGION

echo "✅ Deployed to: https://d12dh91n1av4gw.cloudfront.net"
