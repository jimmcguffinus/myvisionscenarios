"use client"

import { useState, useEffect } from "react"
import { ScenarioList } from "./components/ScenarioList"
import { ScenarioEdit } from "./components/ScenarioEdit"
import { SearchBar } from "./components/SearchBar"
import type { Scenario } from "./types/scenario"
import { parseCSV } from "./utils/csv-parser"
import { Loader2 } from "lucide-react"

export default function App() {
  const [scenarios, setScenarios] = useState<Scenario[]>([])
  const [filteredScenarios, setFilteredScenarios] = useState<Scenario[]>([])
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/vision_scenarios_reduced.csv")
        const csvText = await response.text()
        const parsedData = parseCSV(csvText)
        setScenarios(parsedData)
        setFilteredScenarios(parsedData)
        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching or parsing CSV:", error)
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredScenarios(scenarios)
      return
    }

    const query = searchQuery.toLowerCase()
    const filtered = scenarios.filter(
      (scenario) =>
        scenario.Summary?.toLowerCase().includes(query) ||
        scenario.Narrative?.toLowerCase().includes(query) ||
        scenario.CuratedWords?.toLowerCase().includes(query),
    )

    setFilteredScenarios(filtered)
  }, [searchQuery, scenarios])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  const handleSelectScenario = (scenario: Scenario) => {
    setSelectedScenario(scenario)
  }

  const handleBackToList = () => {
    setSelectedScenario(null)
  }

  const handleUpdateScenario = (updatedScenario: Scenario) => {
    const updatedScenarios = scenarios.map((s) => (s.ID === updatedScenario.ID ? updatedScenario : s))
    setScenarios(updatedScenarios)
    setFilteredScenarios(filteredScenarios.map((s) => (s.ID === updatedScenario.ID ? updatedScenario : s)))
    setSelectedScenario(null)
  }

  const handleDeleteScenario = (id: string) => {
    const updatedScenarios = scenarios.filter((s) => s.ID !== id)
    setScenarios(updatedScenarios)
    setFilteredScenarios(filteredScenarios.filter((s) => s.ID !== id))
    setSelectedScenario(null)
  }

  const handleCreateScenario = (newScenario: Omit<Scenario, "ID">) => {
    const id = `VS${Math.floor(Math.random() * 10000)}`
    const scenarioWithId = { ...newScenario, ID: id } as Scenario

    setScenarios([...scenarios, scenarioWithId])
    setFilteredScenarios([...filteredScenarios, scenarioWithId])
    setSelectedScenario(null)
  }

  return (
    <div className="min-h-screen bg-black text-purple-light p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-purple-accent drop-shadow-md">Vision Scenario Manager</h1>

        {selectedScenario ? (
          <ScenarioEdit
            scenario={selectedScenario}
            onBack={handleBackToList}
            onUpdate={handleUpdateScenario}
            onDelete={handleDeleteScenario}
          />
        ) : (
          <>
            <div className="mb-6 flex justify-between items-center">
              <SearchBar onSearch={handleSearch} />
              <button
                onClick={() =>
                  setSelectedScenario({
                    ID: "",
                    Summary: "",
                    DangerRanking: 0,
                    drv: 0,
                    Impact: "",
                    Narrative: "",
                    CuratedWords: "",
                  } as Scenario)
                }
                className="bg-purple-dark hover:bg-purple-highlight text-white px-4 py-2 rounded-md transition-colors font-medium shadow-md"
              >
                Create New Scenario
              </button>
            </div>

            {isLoading ? (
              <div className="flex flex-col justify-center items-center h-64 bg-black rounded-lg border border-purple-dark/30 shadow-xl">
                <Loader2 className="h-12 w-12 text-purple-accent animate-spin mb-4" />
                <p className="text-purple-light">Loading scenarios...</p>
              </div>
            ) : (
              <>
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-purple-muted">
                    Showing {filteredScenarios.length} of {scenarios.length} scenarios
                  </p>
                  {searchQuery && (
                    <p className="text-purple-muted">
                      Search results for: <span className="text-purple-light">"{searchQuery}"</span>
                    </p>
                  )}
                </div>
                <ScenarioList scenarios={filteredScenarios} onSelectScenario={handleSelectScenario} />
              </>
            )}
          </>
        )}
      </div>
    </div>
  )
}
