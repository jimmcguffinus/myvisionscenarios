#!/bin/bash

# Script to install required dependencies for the Vision Scenarios app

echo "🚀 Installing required dependencies for the Vision Scenarios app..."

# Install React and React DOM
echo "📦 Installing React core libraries..."
npm install react react-dom

# Install React Router DOM
echo "📦 Installing react-router-dom..."
npm install react-router-dom

# Install notification libraries
echo "📦 Installing notification libraries..."
npm install react-hot-toast

# Install UI component libraries
echo "📦 Installing UI component libraries..."
npm install lucide-react 
npm install @radix-ui/react-dialog @radix-ui/react-alert-dialog @radix-ui/react-tabs @radix-ui/react-toast
npm install react-toastify

# Install Tailwind and related packages
echo "📦 Installing Tailwind CSS and related packages..."
npm install tailwindcss postcss autoprefixer @tailwindcss/postcss

# Install shadcn/ui dependencies
echo "📦 Installing shadcn/ui dependencies..."
npm install class-variance-authority clsx tailwind-merge

# Install dev dependencies
echo "📦 Installing dev dependencies..."
npm install -D @types/react @types/react-dom @types/node

echo "✅ All dependencies installed! Run 'npm run build' to verify everything works correctly."
echo "🔍 If TypeScript errors persist, try running 'npm install' to resolve any remaining dependencies." 