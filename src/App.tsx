"use client"

import { useState, useEffect } from "react"
import { Routes, Route, useParams } from "react-router-dom"
import { Toaster } from "react-hot-toast"
import ScenarioList from "./components/ScenarioList"
import { ScenarioEdit } from "./components/ScenarioEdit"
import { AIExplain } from "./components/AIExplain"
import { PrintView } from "./components/PrintView"
import GhostBusters from "./components/GhostBusters"
import type { Scenario } from "./types/scenario"
import { parseCSV } from "./utils/csv-parser"
import "./index.css"

// ScenarioEdit wrapper to get ID from route params
function ScenarioEditWrapper({ scenarios, onUpdate, onDelete, onCreate }: {
  scenarios: Scenario[];
  onUpdate: (scenario: Scenario) => void;
  onDelete?: (id: string) => void;
  onCreate?: (scenario: Omit<Scenario, "ID">) => void;
}) {
  const { id } = useParams();
  const scenario = id ? scenarios.find(s => s.ID === id) : null;
  
  if (id && !scenario) {
    return <div>Scenario not found</div>;
  }
  
  return (
    <ScenarioEdit
      scenario={scenario as Scenario | null}
      onBack={() => {/* navigation handled by router */}}
      onUpdate={onUpdate}
      onDelete={onDelete || (() => {})}
      onCreate={onCreate}
    />
  );
}

// PrintView wrapper to get ID from route params
function PrintViewWrapper({ scenarios }: {
  scenarios: Scenario[];
}) {
  const { id } = useParams();
  const scenario = id ? scenarios.find(s => s.ID === id) : null;
  
  if (!scenario) {
    return <div>Scenario not found</div>;
  }
  
  return <PrintView scenario={scenario} />;
}

// AIExplain wrapper to get ID from route params
function AIExplainWrapper({ scenarios }: {
  scenarios: Scenario[];
}) {
  const { id } = useParams();
  const scenario = id ? scenarios.find(s => s.ID === id) : null;
  
  if (!scenario) {
    return <div>Scenario not found</div>;
  }
  
  return <AIExplain scenario={scenario} />;
}

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
              <ScenarioEditWrapper
                scenarios={scenarios}
                onUpdate={handleUpdateScenario}
                onDelete={handleDeleteScenario}
              />
            }
          />
          <Route
            path="/new"
            element={
              <ScenarioEditWrapper
                scenarios={scenarios}
                onUpdate={handleUpdateScenario}
                onCreate={handleCreateScenario}
              />
            }
          />
          <Route
            path="/print/:id"
            element={<PrintViewWrapper scenarios={scenarios} />}
          />
          <Route
            path="/ai-explain/:id"
            element={<AIExplainWrapper scenarios={scenarios} />}
          />
          <Route path="/ghostbusters" element={<GhostBusters />} />
        </Routes>
      </div>
      <Toaster position="top-right" />
    </div>
  );
}

export default App;