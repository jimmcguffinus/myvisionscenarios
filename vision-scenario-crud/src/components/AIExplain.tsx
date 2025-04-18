"use client"

import { useState, useRef } from "react"
import type { Scenario } from "../types/scenario"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Copy, Check } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface AIExplainProps {
  scenario: Scenario
}

type Persona = "Serious" | "Top Ophthalmologist" | "Redneck" | "Hillbilly" | "TenYearOld"

export function AIExplain({ scenario }: AIExplainProps) {
  const [persona, setPersona] = useState<Persona>("Serious")
  const [explanation, setExplanation] = useState<string>("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const generateExplanation = () => {
    setIsGenerating(true)

    // Simulate AI generation with placeholder logic
    setTimeout(() => {
      const explanations: Record<Persona, string> = {
        Serious: `This is a serious analysis of the vision scenario "${scenario.Summary}". The danger ranking is ${scenario.DangerRanking}/10 with a DRV of ${scenario.drv}. The impact would be: ${scenario.Impact}. Based on the narrative and curated words, this scenario requires careful consideration.`,

        "Top Ophthalmologist": `From my expert ophthalmological perspective, the vision scenario "${scenario.Summary}" presents interesting challenges. With a danger ranking of ${scenario.DangerRanking}/10 and DRV of ${scenario.drv}, we must consider the ocular implications. The impact on vision health could include ${scenario.Impact}. My professional recommendation would be to monitor this situation closely.`,

        Redneck: `Well hot dang! This here vision thing about "${scenario.Summary}" is rated ${scenario.DangerRanking} outta 10 on the danger scale! That's like comparing a possum to a wildcat! With a fancy number of ${scenario.drv}, it's gonna impact us with ${scenario.Impact}. I reckon we oughta keep our eyes peeled!`,

        Hillbilly: `Weeee doggy! This vision scenario 'bout "${scenario.Summary}" is mighty troublesome at ${scenario.DangerRanking}/10 danger! That there DRV number is ${scenario.drv} which is higher than a cat's back! The impact's gonna be ${scenario.Impact} and that's no hill of beans! Better get the whole holler warned 'bout this!`,

        TenYearOld: `OMG this vision thing called "${scenario.Summary}" is super scary! It's like ${scenario.DangerRanking} out of 10 on the scary meter! The DRV is ${scenario.drv} which I don't really get but sounds important. It could make ${scenario.Impact} happen which would be totally not cool! My teacher would probably make us do a project about this.`,
      }

      setExplanation(explanations[persona])
      setIsGenerating(false)
    }, 1500)
  }

  const copyToClipboard = () => {
    if (textareaRef.current && explanation) {
      navigator.clipboard
        .writeText(explanation)
        .then(() => {
          setIsCopied(true)
          toast({
            title: "Copied to clipboard",
            description: "The AI explanation has been copied to your clipboard",
            duration: 3000,
          })
          setTimeout(() => setIsCopied(false), 2000)
        })
        .catch((err) => {
          console.error("Failed to copy text: ", err)
          toast({
            title: "Copy failed",
            description: "Could not copy to clipboard. Please try again.",
            variant: "destructive",
            duration: 3000,
          })
        })
    }
  }

  return (
    <Card className="bg-black border-purple-dark shadow-lg">
      <CardHeader className="bg-gray-900 rounded-t-lg border-b border-purple-dark/30">
        <CardTitle className="text-purple-accent">AI Explanation Generator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <label className="text-purple-accent font-medium block">Select Persona</label>
          <Select value={persona} onValueChange={(value) => setPersona(value as Persona)}>
            <SelectTrigger className="bg-gray-900 border-purple-dark text-purple-light">
              <SelectValue placeholder="Select a persona" />
            </SelectTrigger>
            <SelectContent className="bg-black border-purple-dark text-purple-light">
              <SelectItem value="Serious">Serious</SelectItem>
              <SelectItem value="Top Ophthalmologist">Top Ophthalmologist</SelectItem>
              <SelectItem value="Redneck">Redneck</SelectItem>
              <SelectItem value="Hillbilly">Hillbilly</SelectItem>
              <SelectItem value="TenYearOld">Ten Year Old</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={generateExplanation}
          disabled={isGenerating}
          className="w-full bg-purple-dark hover:bg-purple-highlight text-white font-medium shadow-md"
        >
          {isGenerating ? "Generating..." : "AI Explain"}
        </Button>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-purple-accent font-medium block">AI Explanation</label>
            {explanation && (
              <Button
                onClick={copyToClipboard}
                variant="outline"
                size="sm"
                className="bg-transparent border-purple-dark text-purple-accent hover:bg-purple-dark hover:text-white"
              >
                {isCopied ? (
                  <>
                    <Check className="h-4 w-4 mr-1" /> Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-1" /> Copy
                  </>
                )}
              </Button>
            )}
          </div>
          <Textarea
            ref={textareaRef}
            value={explanation}
            readOnly
            rows={8}
            placeholder="AI explanation will appear here after generation..."
            className="bg-gray-900 border-purple-dark text-purple-light focus:ring-purple-highlight"
          />
        </div>
      </CardContent>
    </Card>
  )
}
