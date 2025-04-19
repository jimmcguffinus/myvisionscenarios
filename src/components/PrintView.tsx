"use client"
import type { Scenario } from "../types/scenario"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Printer } from "lucide-react"

interface PrintViewProps {
  scenario: Scenario
}

export function PrintView({ scenario }: PrintViewProps) {
  // Function to handle printing
  const handlePrint = () => {
    window.print()
  }

  // Function to get danger level class
  const getDangerLevelClass = (ranking: number) => {
    if (ranking >= 8) return "text-red-500 font-bold print:text-red-600"
    if (ranking >= 5) return "text-orange-500 font-bold print:text-orange-600"
    return "text-green-500 font-bold print:text-green-600"
  }

  return (
    <Card className="bg-black border-purple-dark shadow-lg print:bg-white print:text-black print:shadow-none print:border-none">
      <CardHeader className="bg-gray-900 rounded-t-lg border-b border-purple-dark/30 flex flex-row justify-between items-center print:bg-white print:text-black print:border-none">
        <CardTitle className="text-purple-accent print:text-purple-dark">Print-Friendly View</CardTitle>
        <Button
          onClick={handlePrint}
          className="bg-purple-dark hover:bg-purple-highlight text-white print:hidden"
          size="sm"
        >
          <Printer className="mr-2 h-4 w-4" />
          Print
        </Button>
      </CardHeader>
      <CardContent className="p-6 space-y-6 print:text-black">
        {/* Print-friendly content with unique ID */}
        <div id="print-content" className="space-y-4 print:text-black">
          <div className="print:hidden text-purple-muted text-sm mb-4">
            Click the Print button above to print this scenario, or use your browser's print function while viewing this
            tab.
          </div>

          <div className="print:mb-8">
            <h1 className="text-2xl font-bold text-purple-accent print:text-purple-dark print:border-b print:border-purple-dark print:pb-2 print:mb-4">
              Vision Scenario Report
            </h1>
            <p className="text-purple-muted print:text-gray-600 text-sm">
              Generated on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
            </p>
          </div>

          <div className="space-y-1 print:mb-4">
            <h3 className="text-purple-accent font-medium print:text-purple-dark">ID</h3>
            <p className="text-purple-light print:text-gray-900">{scenario.ID || "N/A"}</p>
          </div>

          <div className="space-y-1 print:mb-4">
            <h3 className="text-purple-accent font-medium print:text-purple-dark">Summary</h3>
            <p className="text-purple-light print:text-gray-900">{scenario.Summary || "N/A"}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 print:mb-4">
            <div className="space-y-1">
              <h3 className="text-purple-accent font-medium print:text-purple-dark">Danger Ranking</h3>
              <p className={`${getDangerLevelClass(scenario.DangerRanking)}`}>{scenario.DangerRanking}/10</p>
            </div>

            <div className="space-y-1">
              <h3 className="text-purple-accent font-medium print:text-purple-dark">DRV</h3>
              <p className="text-purple-light print:text-gray-900">{scenario.drv}</p>
            </div>
          </div>

          <div className="space-y-1 print:mb-4">
            <h3 className="text-purple-accent font-medium print:text-purple-dark">Impact</h3>
            <p className="text-purple-light print:text-gray-900">{scenario.Impact || "N/A"}</p>
          </div>

          <div className="space-y-1 print:mb-4">
            <h3 className="text-purple-accent font-medium print:text-purple-dark">Narrative</h3>
            <div className="bg-gray-900 p-4 rounded-md border border-purple-dark/30 text-purple-light print:bg-gray-100 print:text-gray-900 print:border-gray-300">
              {scenario.Narrative ? (
                scenario.Narrative.split("\n").map((paragraph, index) => (
                  <p key={index} className="mb-2">
                    {paragraph}
                  </p>
                ))
              ) : (
                <p className="text-purple-muted italic print:text-gray-500">No narrative provided</p>
              )}
            </div>
          </div>

          <div className="space-y-1 print:mb-4">
            <h3 className="text-purple-accent font-medium print:text-purple-dark">Curated Words</h3>
            <p className="text-purple-light print:text-gray-900">{scenario.CuratedWords || "N/A"}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 