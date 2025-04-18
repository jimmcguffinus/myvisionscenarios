import type { Scenario } from "../types/scenario"

export function parseCSV(csvText: string): Scenario[] {
  const lines = csvText.split("\n")

  // Extract headers (first line)
  const headers = lines[0].split(",").map((header) => header.trim())

  // Map CSV data to Scenario objects
  const scenarios: Scenario[] = []

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue // Skip empty lines

    // Handle commas within quoted fields
    const values: string[] = []
    let currentValue = ""
    let inQuotes = false

    for (let j = 0; j < line.length; j++) {
      const char = line[j]

      if (char === '"') {
        inQuotes = !inQuotes
      } else if (char === "," && !inQuotes) {
        values.push(currentValue)
        currentValue = ""
      } else {
        currentValue += char
      }
    }

    // Add the last value
    values.push(currentValue)

    // Create scenario object
    const scenario: any = {}

    headers.forEach((header, index) => {
      if (index < values.length) {
        let value = values[index].trim()

        // Remove surrounding quotes if present
        if (value.startsWith('"') && value.endsWith('"')) {
          value = value.substring(1, value.length - 1)
        }

        // Convert numeric fields
        if (header === "DangerRanking" || header === "drv") {
          scenario[header] = Number.parseFloat(value) || 0
        } else {
          scenario[header] = value
        }
      }
    })

    scenarios.push(scenario as Scenario)
  }

  return scenarios
}
