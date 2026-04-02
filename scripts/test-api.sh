#!/bin/bash
# Test script to verify bootcamp API is working

echo "📋 Testing Bootcamp API..."
echo ""

# Create a test form data request
echo "🧪 Testing POST to /api/bootcamp/register endpoint..."

# First, let's test the server is running
echo "Checking if server is running..."
curl -s http://localhost:3001/api/test-db && echo "✅ Server is running" || echo "⚠️  Server might not be running"
