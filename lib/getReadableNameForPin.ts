import { su } from "@tscircuit/circuit-json-util"
import type {
  AnyCircuitElement,
} from "circuit-json"
import { scorePhrase } from "./scorePhrase"

export const getReadableNameForPin = ({
  circuitJson,
  source_port_id,
}: {
  circuitJson: AnyCircuitElement[]
  source_port_id: string
}): string => {
  const source_ports = su(circuitJson as any).source_port.list()
  const source_components = su(circuitJson as any).source_component.list()

  const port = source_ports.find((p) => p.source_port_id === source_port_id)
  if (!port) return ""

  const component = source_components.find(
    (c) => c.source_component_id === port.source_component_id,
  )
  if (!component) return ""

  // Use the best possible name from hints if name is just "pinX"
  let mainPinName = port.name || `Pin${port.pin_number}`
  
  const hints = port.port_hints || []
  const isGenericName = /^pin\d+$/i.test(mainPinName)

  if (isGenericName && hints.length > 0) {
    // Find the best hint to use as a name
    const bestHint = hints.reduce((best, current) => {
      return scorePhrase(current) > scorePhrase(best) ? current : best
    }, hints[0])
    
    if (scorePhrase(bestHint) > 1) {
      mainPinName = bestHint
    }
  }

  const additionalPinLabels: string[] = []
  
  // Determine pin polarity from hints for additional labeling
  const isPositive = hints.some((hint) =>
    ["anode", "pos", "positive"].includes(hint.toLowerCase()),
  )
  const isNegative = hints.some((hint) =>
    ["cathode", "neg", "negative"].includes(hint.toLowerCase()),
  )

  if (isPositive && component.ftype !== "simple_resistor") {
    additionalPinLabels.push("+")
  } else if (isNegative && component.ftype !== "simple_resistor") {
    additionalPinLabels.push("-")
  }

  // Add other useful hints that aren't the main name
  for (const port_hint of hints) {
    if (port_hint.toLowerCase() === mainPinName.toLowerCase()) continue
    if (additionalPinLabels.includes(port_hint)) continue
    const score = scorePhrase(port_hint)
    if (score > 1) {
      additionalPinLabels.push(port_hint)
    }
  }

  const displayValue = component.display_value
    ? ` (${component.display_value})`
    : ""
    
  return `${component.name} ${mainPinName}${additionalPinLabels.length > 0 ? ` (${additionalPinLabels.join(",")})` : ""}${displayValue}`
}
