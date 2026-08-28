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

  // Format pin description
  const mainPinName = port.name ? port.name : `Pin${port.pin_number}`

  const additionalPinLabels = new Map<string, string>()
  const addPinAlias = (label: string) => {
    const normalized = label.trim()
    if (!normalized) return
    const key = normalized.toLowerCase()
    if (!additionalPinLabels.has(key)) {
      additionalPinLabels.set(key, normalized)
    }
  }

  if (isPositive && component.ftype !== "simple_resistor") {
    addPinAlias("+")
  } else if (isNegative && component.ftype !== "simple_resistor") {
    addPinAlias("-")
  }

  for (const port_hint of port.port_hints ?? []) {
    if (port_hint === mainPinName) continue
    const score = scorePhrase(port_hint)
    if (score > 1) {
      addPinAlias(port_hint)
    }
  }

  const displayValue = component.display_value
    ? ` (${component.display_value})`
    : ""
  const additionalLabels = Array.from(additionalPinLabels.values())
  return `${component.name} ${mainPinName}${additionalLabels.length > 0 ? ` (${additionalLabels.join(",")})` : ""}${displayValue}`
}
