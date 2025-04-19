#!/bin/bash

# Script to install required dependencies for the Vision Scenarios app

echo "Installing required dependencies..."

# Install React Router DOM
echo "Installing react-router-dom..."
npm install react-router-dom

# Install other dependencies if needed
echo "Checking for other dependencies..."
npm install @radix-ui/react-dialog react-toastify @tailwindcss/postcss

echo "Done! Run 'npm run build' to verify everything works." 