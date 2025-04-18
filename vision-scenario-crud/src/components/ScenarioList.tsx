"use client"

import type { Scenario } from "../types/scenario"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, AlertTriangle } from "lucide-react"

interface ScenarioListProps {
  scenarios: Scenario[]
  onSelectScenario: (scenario: Scenario) => void
}

export function ScenarioList({ scenarios, onSelectScenario }: ScenarioListProps) {
  const getDangerColor = (ranking: number) => {
    if (ranking >= 8) return "bg-red-600 hover:bg-red-700"
    if (ranking >= 5) return "bg-orange-500 hover:bg-orange-600"
    if (ranking >= 3) return "bg-yellow-500 hover:bg-yellow-600"
    return "bg-green-600 hover:bg-green-700"
  }

  const getDangerRowClass = (ranking: number) => {
    if (ranking >= 8) return "border-red-900/20 bg-red-950/10"
    if (ranking >= 5) return "border-orange-900/20 bg-orange-950/10"
    if (ranking >= 3) return "border-yellow-900/20 bg-yellow-950/10"
    return ""
  }

  const getDangerIcon = (ranking: number) => {
    if (ranking >= 8) return <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
    if (ranking >= 5) return <AlertTriangle className="h-4 w-4 text-orange-500 mr-2" />
    return null
  }

  const getDrvBadge = (drv: number) => {
    if (drv > 0) {
      return <Badge className="bg-green-700 hover:bg-green-800">Y</Badge>
    } else {
      return <Badge className="bg-gray-700 hover:bg-gray-800">N</Badge>
    }
  }

  return (
    <div className="bg-black rounded-lg shadow-xl overflow-hidden border border-purple-dark/30">
      {scenarios.length === 0 ? (
        <div className="p-8 text-center text-purple-muted">No scenarios found. Try adjusting your search criteria.</div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-900">
              <TableRow className="border-b border-purple-dark/30">
                <TableHead className="text-purple-accent font-bold">ID</TableHead>
                <TableHead className="text-purple-accent font-bold">Summary</TableHead>
                <TableHead className="text-purple-accent font-bold">Danger</TableHead>
                <TableHead className="text-purple-accent font-bold">DRV</TableHead>
                <TableHead className="text-purple-accent font-bold">Impact</TableHead>
                <TableHead className="text-purple-accent font-bold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {scenarios.map((scenario) => (
                <TableRow
                  key={scenario.ID}
                  className={`border-b border-gray-800 hover:bg-gray-900 cursor-pointer transition-colors ${getDangerRowClass(
                    scenario.DangerRanking,
                  )}`}
                  onClick={() => onSelectScenario(scenario)}
                >
                  <TableCell className="font-mono text-purple-light bg-black">{scenario.ID}</TableCell>
                  <TableCell className="text-purple-light font-medium bg-black flex items-center">
                    {getDangerIcon(scenario.DangerRanking)}
                    {scenario.Summary}
                  </TableCell>
                  <TableCell className="bg-black">
                    <Badge className={`${getDangerColor(scenario.DangerRanking)}`}>{scenario.DangerRanking}</Badge>
                  </TableCell>
                  <TableCell className="text-purple-light bg-black">{getDrvBadge(scenario.drv)}</TableCell>
                  <TableCell className="text-purple-light max-w-[200px] truncate bg-black">{scenario.Impact}</TableCell>
                  <TableCell className="bg-black">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onSelectScenario(scenario)
                      }}
                      className="bg-purple-dark hover:bg-purple-highlight text-white px-3 py-1 rounded-md text-sm transition-colors shadow-sm"
                    >
                      Edit
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
