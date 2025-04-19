#!/bin/bash

# Script to convert the Node.js Vision Scenarios CRUD app to a Vite + React app

echo "🚀 Starting conversion of Vision Scenarios CRUD to Vite + React app..."

# Create a new directory for the Vite project
echo "📁 Creating new Vite project directory..."
mkdir -p vision-vite
cd vision-vite

# Initialize a new Vite project with React and TypeScript
echo "🔧 Initializing new Vite project with React and TypeScript..."
npm create vite@latest . -- --template react-ts

# Install additional dependencies
echo "📦 Installing additional dependencies..."
npm install react-router-dom react-hot-toast lucide-react
npm install -D tailwindcss postcss autoprefixer @tailwindcss/forms

# Initialize Tailwind CSS
echo "🎨 Initializing Tailwind CSS..."
npx tailwindcss init -p

# Setup shadcn UI
echo "🧩 Setting up shadcn UI..."
npx shadcn-ui@latest init

# Copy component files from the Next.js project
echo "📋 Copying components from original project..."
mkdir -p src/components/ui
cp -r ../vision-scenario-crud/components/ui/* src/components/ui/ || echo "Warning: UI components not copied."
cp -r ../vision-scenario-crud/src/components/* src/components/ || echo "Warning: Components not copied."
cp -r ../vision-scenario-crud/src/types src/ || echo "Warning: Types not copied."
cp -r ../vision-scenario-crud/src/utils src/ || echo "Warning: Utils not copied."
cp -r ../vision-scenario-crud/src/lib src/ || echo "Warning: Lib not copied."
cp ../vision-scenario-crud/src/index.css src/ || echo "Warning: CSS not copied."

# Create the basic files needed for the app
echo "📝 Creating necessary Vite app files..."
cat > src/main.tsx << 'EOL'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'
import { Toaster } from "react-hot-toast"

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster position="top-right" />
    </BrowserRouter>
  </React.StrictMode>,
)
EOL

# Create the App.tsx file
echo "🖥️ Creating App.tsx with React Router..."
cat > src/App.tsx << 'EOL'
import { useState, useEffect } from "react"
import { Routes, Route } from "react-router-dom"
import { ScenarioList } from "./components/ScenarioList"
import { ScenarioEdit } from "./components/ScenarioEdit"
import AIExplain from "./components/AIExplain"
import PrintView from "./components/PrintView"
import GhostBusters from "./components/GhostBusters"
import type { Scenario } from "./types/scenario"
import { parseCSV } from "./utils/csv-parser"

function App() {
  const [scenarios, setScenarios] = useState<Scenario[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/vision_scenarios_reduced.csv")
        const csvText = await response.text()
        const parsedData = parseCSV(csvText)
        setScenarios(parsedData)
        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching or parsing CSV:", error)
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleUpdateScenario = (updatedScenario: Scenario) => {
    setScenarios(scenarios.map((s) => (s.ID === updatedScenario.ID ? updatedScenario : s)))
  }

  const handleDeleteScenario = (id: string) => {
    setScenarios(scenarios.filter((s) => s.ID !== id))
  }

  const handleCreateScenario = (newScenario: Omit<Scenario, "ID">) => {
    const id = `VS${Math.floor(Math.random() * 10000)}`
    const scenarioWithId = { ...newScenario, ID: id } as Scenario
    setScenarios([...scenarios, scenarioWithId])
  }

  return (
    <div className="min-h-screen bg-black text-purple-light p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-purple-accent drop-shadow-md">
          Vision Scenario Manager
        </h1>

        <Routes>
          <Route
            path="/"
            element={
              <ScenarioList 
                scenarios={scenarios} 
                onDelete={handleDeleteScenario}
                isLoading={isLoading}
              />
            }
          />
          <Route
            path="/edit/:id"
            element={
              <ScenarioEdit
                scenarios={scenarios}
                onUpdate={handleUpdateScenario}
                onDelete={handleDeleteScenario}
              />
            }
          />
          <Route
            path="/new"
            element={
              <ScenarioEdit
                scenarios={scenarios}
                onUpdate={handleUpdateScenario}
                onCreate={handleCreateScenario}
              />
            }
          />
          <Route
            path="/print/:id"
            element={<PrintView scenarios={scenarios} />}
          />
          <Route
            path="/ai-explain/:id"
            element={<AIExplain scenarios={scenarios} />}
          />
          <Route path="/ghostbusters" element={<GhostBusters />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
EOL

# Create GhostBusters component
echo "👻 Creating GhostBusters component..."
mkdir -p src/components
cat > src/components/GhostBusters.tsx << 'EOL'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

function GhostBusters() {
  const [timestamp, setTimestamp] = useState(new Date().toISOString())
  
  useEffect(() => {
    const interval = setInterval(() => {
      setTimestamp(new Date().toISOString())
    }, 1000)
    
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
      <div className="text-center max-w-4xl mx-auto">
        <h1 className="text-5xl font-extrabold mb-6 text-green-500">
          🚫👻 GHOSTBUSTERS EDITION 👻🚫
        </h1>
        
        <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-8 mb-8">
          <p className="text-xl mb-4">
            This is the cache-busting version of the app. If you're seeing this page, 
            the deployment was successful!
          </p>
          
          <p className="text-green-400 font-mono text-sm mb-6">
            Build Timestamp: {timestamp}
          </p>
          
          <div className="flex items-center justify-center space-x-4">
            <Link 
              to="/"
              className="bg-green-600 hover:bg-green-500 text-white px-6 py-3 rounded-md transition-colors font-medium shadow-md"
            >
              Return to Main App
            </Link>
          </div>
        </div>
        
        <div className="text-gray-400 mt-8">
          <p className="italic">
            "Who ya gonna call? GHOSTBUSTERS!"
          </p>
        </div>
      </div>
    </div>
  )
}

export default GhostBusters
EOL

# Setup path aliases in tsconfig.json
echo "⚙️ Setting up path aliases in tsconfig.json..."
cat > tsconfig.json << 'EOL'
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
EOL

# Configure Vite
echo "🛠️ Configuring Vite..."
cat > vite.config.ts << 'EOL'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})
EOL

# Copy over the CSV data file
echo "📊 Copying CSV data file..."
mkdir -p public
cp ../vision-scenario-crud/public/vision_scenarios_reduced.csv public/ || echo "Warning: CSV file not copied."

# Update package.json
echo "📝 Updating package.json..."
cat > package.json << 'EOL'
{
  "name": "vision-scenarios",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.17.0",
    "react-hot-toast": "^2.4.1",
    "lucide-react": "^0.292.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^1.14.0"
  },
  "devDependencies": {
    "@types/node": "^20.8.9",
    "@types/react": "^18.2.33",
    "@types/react-dom": "^18.2.14",
    "@vitejs/plugin-react": "^4.1.0",
    "typescript": "^5.2.2",
    "vite": "^4.5.0",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.31",
    "tailwindcss": "^3.3.5",
    "eslint": "^8.52.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.4"
  }
}
EOL

# Configure Tailwind CSS
echo "🎨 Configuring Tailwind CSS..."
cat > tailwind.config.js << 'EOL'
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'purple-light': '#d9c7f0',
        'purple-dark': '#5e4b8b',
        'purple-accent': '#b48ead',
        'purple-highlight': '#8a67cf',
        'purple-muted': '#a5a0b3',
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
EOL

# Configure index.css with Tailwind directives
echo "🎨 Configuring index.css with Tailwind directives..."
cat > src/index.css << 'EOL'
@tailwind base;
@tailwind components;
@tailwind utilities;
 
@layer base {
  :root {
    --background: 0 0% 0%;
    --foreground: 270 33% 99%;
    
    --card: 0 0% 5%;
    --card-foreground: 0 0% 95%;
 
    --popover: 0 0% 5%;
    --popover-foreground: 0 0% 95%;
 
    --primary: 272 32% 83%;
    --primary-foreground: 0 0% 9%;
 
    --secondary: 270 20% 42%;
    --secondary-foreground: 0 0% 98%;
 
    --muted: 270 10% 35%;
    --muted-foreground: 0 0% 70%;
 
    --accent: 300 35% 66%;
    --accent-foreground: 0 0% 10%;
 
    --destructive: 0 100% 50%;
    --destructive-foreground: 0 0% 98%;
 
    --border: 270 20% 30%;
    --input: 270 20% 25%;
    --ring: 280 40% 50%;
 
    --radius: 0.5rem;
  }
 
  .dark {
    --background: 0 0% 0%;
    --foreground: 270 33% 99%;
    
    --card: 0 0% 5%;
    --card-foreground: 0 0% 95%;
 
    --popover: 0 0% 5%;
    --popover-foreground: 0 0% 95%;
 
    --primary: 272 32% 83%;
    --primary-foreground: 0 0% 9%;
 
    --secondary: 270 20% 42%;
    --secondary-foreground: 0 0% 98%;
 
    --muted: 270 10% 35%;
    --muted-foreground: 0 0% 70%;
 
    --accent: 300 35% 66%;
    --accent-foreground: 0 0% 10%;
 
    --destructive: 0 100% 50%;
    --destructive-foreground: 0 0% 98%;
 
    --border: 270 20% 30%;
    --input: 270 20% 25%;
    --ring: 280 40% 50%;
  }
}
 
@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
EOL

# Create HTML file
echo "📄 Creating index.html..."
cat > index.html << 'EOL'
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
    <meta http-equiv="Pragma" content="no-cache" />
    <meta http-equiv="Expires" content="0" />
    <title>Vision Scenarios</title>
    <script>
      // Unregister any service workers that might be caching content
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then(function(registrations) {
          for (let registration of registrations) {
            registration.unregister();
          }
        });
      }
    </script>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
EOL

# Install dependencies
echo "📦 Installing dependencies..."
npm install

echo "🎉 Conversion complete! New Vite project created in vision-vite directory."
echo "📝 Next steps:"
echo "  1. cd vision-vite"
echo "  2. npm run dev - to start the development server"
echo "  3. Further customize components as needed"
echo ""
echo "Note: You may need to adjust import paths in some component files." 