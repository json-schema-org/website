#!/bin/bash
# Script to update yarn.lock file
# This script should be run after updating package.json dependencies

echo "Enabling Corepack..."
corepack enable

echo "Installing dependencies to update yarn.lock..."
yarn install

echo "Checking if yarn.lock was updated..."
if [ -n "$(git status --porcelain yarn.lock)" ]; then
    echo "✓ yarn.lock has been updated"
    echo "Please commit and push the updated yarn.lock file"
else
    echo "✗ yarn.lock was not updated (it may already be in sync)"
fi
