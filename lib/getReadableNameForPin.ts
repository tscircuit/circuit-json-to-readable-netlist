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

  const portHints = port.port_hints ?? []

  // Determine pin polarity from hints
  const isPositive = portHints.some((hint) =>
    ["anode", "pos", "positive"].includes(hint.toLowerCase()),
  )
  const isNegative = portHints.some((hint) =>
    ["cathode", "neg", "negative"].includes(hint.toLowerCase()),
  )

  // Format pin description
  const firstReadableHint = portHints.find((hint) => scorePhrase(hint) >= 1)
  const mainPinName =
    port.name ??
    (port.pin_number !== undefined ? `Pin${port.pin_number}` : undefined) ??
    firstReadableHint ??
    "unnamed_pin"
  const mainPinNameIsGeneric =
    port.pin_number !== undefined &&
    (mainPinName.toLowerCase() === `pin${port.pin_number}` ||
      mainPinName === String(port.pin_number))

  const additionalPinLabels: string[] = []

  if (isPositive && component.ftype !== "simple_resistor") {
    additionalPinLabels.push("+")
  } else if (isNegative && component.ftype !== "simple_resistor") {
    additionalPinLabels.push("-")
  }

  for (const port_hint of portHints) {
    if (port_hint === mainPinName) continue
    if (
      port.pin_number !== undefined &&
      (port_hint.toLowerCase() === `pin${port.pin_number}` ||
        port_hint === String(port.pin_number))
    ) {
      continue
    }
    const score = scorePhrase(port_hint)
    if (score > 1 || (mainPinNameIsGeneric && score >= 1)) {
      additionalPinLabels.push(port_hint)
    }
  }

  const displayValue = component.display_value
    ? ` (${component.display_value})`
    : ""
  return `${component.name} ${mainPinName}${additionalPinLabels.length > 0 ? ` (${additionalPinLabels.join(",")})` : ""}${displayValue}`
}
