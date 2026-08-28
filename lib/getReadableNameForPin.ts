import { su } from "@tscircuit/circuit-json-util"
import type {
  AnyCircuitElement,
  CircuitJson,
  SourceNet,
  SourcePort,
} from "circuit-json"
import { scorePhrase } from "./scorePhrase"

const isGenericPinLabel = (label: string | undefined, pinNumber?: number) => {
  if (!label) return true
  const normalized = label.toLowerCase()
  return (
    normalized === "pin" ||
    normalized === `pin${pinNumber}` ||
    normalized === String(pinNumber)
  )
}

const getUniquePinHints = (port: SourcePort) =>
  Array.from(new Set(port.port_hints ?? [])).filter(
    (hint) => !isGenericPinLabel(hint, port.pin_number),
  )

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
  const meaningfulHints = getUniquePinHints(port)
  const mainPinName =
    component.ftype === "simple_chip" &&
    isGenericPinLabel(port.name, port.pin_number) &&
    meaningfulHints.length > 0
      ? meaningfulHints[0]
      : port.name || `Pin${port.pin_number}`

  const additionalPinLabels: string[] = []

  if (isPositive && component.ftype !== "simple_resistor") {
    additionalPinLabels.push("+")
  } else if (isNegative && component.ftype !== "simple_resistor") {
    additionalPinLabels.push("-")
  }

  for (const port_hint of meaningfulHints) {
    if (port_hint === mainPinName) continue
    const score = scorePhrase(port_hint)
    if (component.ftype === "simple_chip" || score > 1) {
      additionalPinLabels.push(port_hint)
    }
  }

  const displayValue = component.display_value
    ? ` (${component.display_value})`
    : ""
  return `${component.name} ${mainPinName}${additionalPinLabels.length > 0 ? ` (${additionalPinLabels.join(",")})` : ""}${displayValue}`
}
