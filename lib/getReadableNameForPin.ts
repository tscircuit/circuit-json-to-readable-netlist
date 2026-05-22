import { su } from "@tscircuit/circuit-json-util"
import type {
  AnyCircuitElement,
  CircuitJson,
  SourceNet,
  SourcePort,
} from "circuit-json"
import { scorePhrase } from "./scorePhrase"

export const getReadableNameForPin = ({
  circuitJson,
  source_port_id,
}: {
  circuitJson: AnyCircuitElement[]
  source_port_id: string
}): string => {
  const source_ports = su(circuitJson).source_port.list()
  const source_components = su(circuitJson).source_component.list()

  const port = source_ports.find((p) => p.source_port_id === source_port_id)
  if (!port) return ""

  const component = source_components.find(
    (c) => c.source_component_id === port.source_component_id,
  )
  if (!component) return ""

  // Determine pin polarity from hints
  const isPositive = port.port_hints?.some((hint) =>
    ["anode", "pos", "positive"].includes(hint.toLowerCase()),
  )
  const isNegative = port.port_hints?.some((hint) =>
    ["cathode", "neg", "negative"].includes(hint.toLowerCase()),
  )

  // Get all pin labels from port_hints, excluding generic hints
  const genericHints = ["anode", "cathode", "pos", "neg", "positive", "negative", "left", "right"]
  const pinLabels = (port.port_hints ?? []).filter((hint) => {
    const cleanHint = hint.trim()
    return (
      cleanHint.length > 1 &&
      !/^\\d+$/.test(cleanHint) &&
      !genericHints.includes(cleanHint.toLowerCase()) &&
      scorePhrase(cleanHint) > 1
    )
  })

  // Format pin description - prefer port.name as the main identifier
  let mainPinName: string
  if (port.name) {
    mainPinName = port.name
  } else if (pinLabels.length > 0) {
    // Find the pin label with the highest score
    let bestLabel = pinLabels[0]
    let bestScore = scorePhrase(bestLabel)
    
    for (let i = 1; i < pinLabels.length; i++) {
      const label = pinLabels[i]
      const score = scorePhrase(label)
      if (score > bestScore) {
        bestScore = score
        bestLabel = label
      }
    }
    
    mainPinName = bestLabel
  } else {
    mainPinName = `pin${port.pin_number}`
  }

  const additionalPinLabels: string[] = []

  if (isPositive && component.ftype !== "simple_resistor") {
    additionalPinLabels.push("+")
  } else if (isNegative && component.ftype !== "simple_resistor") {
    additionalPinLabels.push("-")
  }

  // Add pin labels as additional labels (all of them if port.name was used as main)
  if (port.name) {
    for (const label of pinLabels) {
      // Skip if the label matches the port.name to avoid duplication
      if (label.toLowerCase() === port.name.toLowerCase()) {
        continue
      }
      const score = scorePhrase(label)
      if (score > 1) {
        additionalPinLabels.push(label)
      }
    }
  } else {
    // Add remaining pin labels (skip the one used as mainPinName)
    for (const label of pinLabels) {
      if (label !== mainPinName) {
        const score = scorePhrase(label)
        if (score > 1) {
          additionalPinLabels.push(label)
        }
      }
    }
  }

  const displayValue = component.display_value
    ? ` (${component.display_value})`
    : ""
  return `${component.name} ${mainPinName}${additionalPinLabels.length > 0 ? ` (${additionalPinLabels.join(",")})` : ""}${displayValue}`
}
