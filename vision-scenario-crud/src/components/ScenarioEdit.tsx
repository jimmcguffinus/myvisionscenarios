"use client"

import type React from "react"

import { useState, useEffect } from "react"
import type { Scenario } from "../types/scenario"
import { AIExplain } from "./AIExplain"
import { PrintView } from "./PrintView"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface ScenarioEditProps {
  scenario: Scenario
  onBack: () => void
  onUpdate: (updatedScenario: Scenario) => void
  onDelete: (id: string) => void
}

export function ScenarioEdit({ scenario, onBack, onUpdate, onDelete }: ScenarioEditProps) {
  const [formData, setFormData] = useState<Scenario>({ ...scenario })
  const [originalData, setOriginalData] = useState<Scenario>({ ...scenario })
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [hasChanges, setHasChanges] = useState(false)
  const isNewScenario = !scenario.ID

  useEffect(() => {
    setOriginalData({ ...scenario })
    setFormData({ ...scenario })
    setFormErrors({})
    setHasChanges(false)
  }, [scenario])

  useEffect(() => {
    // Check if form data has changed from original
    const changed = JSON.stringify(formData) !== JSON.stringify(originalData)
    setHasChanges(changed || isNewScenario)
  }, [formData, originalData, isNewScenario])

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}

    if (!formData.Summary?.trim()) {
      errors.Summary = "Summary is required"
    }

    if (formData.DangerRanking < 0 || formData.DangerRanking > 10) {
      errors.DangerRanking = "Danger Ranking must be between 0 and 10"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target

    // Handle numeric values
    if (name === "DangerRanking" || name === "drv") {
      setFormData({
        ...formData,
        [name]: Number.parseFloat(value) || 0,
      })
    } else {
      setFormData({
        ...formData,
        [name]: value,
      })
    }

    // Clear error for this field if it exists
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: "",
      })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    if (isNewScenario) {
      // For new scenarios, we omit the ID as it will be generated in the parent component
      const { ID, ...scenarioWithoutId } = formData
      onUpdate(formData as Scenario)
    } else {
      onUpdate(formData)
    }
  }

  const RequiredLabel = ({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) => (
    <Label htmlFor={htmlFor} className="text-purple-accent font-medium flex items-center">
      {children}
      <span className="text-red-500 ml-1">*</span>
    </Label>
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Button
          onClick={onBack}
          variant="outline"
          className="bg-transparent border-purple-dark text-purple-accent hover:bg-purple-dark hover:text-white font-medium"
        >
          Back to List
        </Button>
        <h2 className="text-2xl font-bold text-purple-accent drop-shadow-sm">
          {isNewScenario ? "Create New Scenario" : `Edit Scenario: ${scenario.ID}`}
        </h2>

        {!isNewScenario && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="bg-red-700 hover:bg-red-800 font-medium shadow-md">
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-forest-light border-purple-dark text-purple-light">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-purple-accent text-xl">Are you sure?</AlertDialogTitle>
                <AlertDialogDescription className="text-purple-muted">
                  This action cannot be undone. This will permanently delete the scenario.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="bg-forest-light text-purple-accent border-purple-dark hover:bg-forest-DEFAULT">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  className="bg-red-700 hover:bg-red-800 text-white font-medium"
                  onClick={() => onDelete(scenario.ID)}
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>

      <Tabs defaultValue="details" className="w-full">
        <TabsList className="bg-forest-light border-b border-purple-dark w-full justify-start">
          <TabsTrigger
            value="details"
            className="data-[state=active]:bg-purple-dark data-[state=active]:text-white font-medium"
          >
            Scenario Details
          </TabsTrigger>
          <TabsTrigger
            value="ai"
            className="data-[state=active]:bg-purple-dark data-[state=active]:text-white font-medium"
          >
            AI Explanation
          </TabsTrigger>
          <TabsTrigger
            value="print"
            className="data-[state=active]:bg-purple-dark data-[state=active]:text-white font-medium"
          >
            Print
          </TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="mt-4">
          <Card className="bg-black border-purple-dark shadow-lg">
            <CardHeader className="bg-gray-900 rounded-t-lg border-b border-purple-dark/30">
              <CardTitle className="text-purple-accent">Scenario Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {!isNewScenario && (
                  <div className="space-y-2">
                    <Label htmlFor="ID" className="text-purple-accent font-medium">
                      ID
                    </Label>
                    <Input
                      id="ID"
                      name="ID"
                      value={formData.ID}
                      onChange={handleChange}
                      disabled
                      className="bg-gray-900 border-purple-dark text-purple-light focus:ring-purple-highlight"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <RequiredLabel htmlFor="Summary">Summary</RequiredLabel>
                  <Input
                    id="Summary"
                    name="Summary"
                    value={formData.Summary || ""}
                    onChange={handleChange}
                    required
                    className={`bg-gray-900 border-purple-dark text-purple-light focus:ring-purple-highlight ${
                      formErrors.Summary ? "border-red-500" : ""
                    }`}
                  />
                  {formErrors.Summary && <p className="text-red-500 text-sm mt-1">{formErrors.Summary}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <RequiredLabel htmlFor="DangerRanking">Danger Ranking (0-10)</RequiredLabel>
                    <Input
                      id="DangerRanking"
                      name="DangerRanking"
                      type="number"
                      min="0"
                      max="10"
                      step="0.1"
                      value={formData.DangerRanking}
                      onChange={handleChange}
                      className={`bg-gray-900 border-purple-dark text-purple-light focus:ring-purple-highlight ${
                        formErrors.DangerRanking ? "border-red-500" : ""
                      }`}
                    />
                    {formErrors.DangerRanking && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.DangerRanking}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="drv" className="text-purple-accent font-medium">
                      DRV
                    </Label>
                    <Input
                      id="drv"
                      name="drv"
                      type="number"
                      step="0.01"
                      value={formData.drv}
                      onChange={handleChange}
                      className="bg-gray-900 border-purple-dark text-purple-light focus:ring-purple-highlight"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="Impact" className="text-purple-accent font-medium">
                    Impact
                  </Label>
                  <Input
                    id="Impact"
                    name="Impact"
                    value={formData.Impact || ""}
                    onChange={handleChange}
                    className="bg-gray-900 border-purple-dark text-purple-light focus:ring-purple-highlight"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="Narrative" className="text-purple-accent font-medium">
                    Narrative
                  </Label>
                  <Textarea
                    id="Narrative"
                    name="Narrative"
                    value={formData.Narrative || ""}
                    onChange={handleChange}
                    rows={4}
                    className="bg-gray-900 border-purple-dark text-purple-light focus:ring-purple-highlight"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="CuratedWords" className="text-purple-accent font-medium">
                    Curated Words
                  </Label>
                  <Textarea
                    id="CuratedWords"
                    name="CuratedWords"
                    value={formData.CuratedWords || ""}
                    onChange={handleChange}
                    rows={2}
                    className="bg-gray-900 border-purple-dark text-purple-light focus:ring-purple-highlight"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-purple-dark hover:bg-purple-highlight text-white font-medium shadow-md"
                  disabled={!hasChanges}
                >
                  {isNewScenario ? "Create Scenario" : "Update Scenario"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai" className="mt-4">
          <AIExplain scenario={formData} />
        </TabsContent>

        <TabsContent value="print" className="mt-4">
          <PrintView scenario={formData} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
