import { su } from "@tscircuit/circuit-json-util"
import type {
  AnyCircuitElement,
  CircuitJson,
  SourceNet,
  SourcePort,
} from "circuit-json"
import { scorePhrase } from "./scorePhrase"

const isGenericPinHint = (hint: string, pinNumber?: number): boolean => {
  if (hint === String(pinNumber)) return true
  return /^pin\d+$/i.test(hint)
}

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

  const additionalPinLabels: string[] = []

  if (isPositive && component.ftype !== "simple_resistor") {
    additionalPinLabels.push("+")
  } else if (isNegative && component.ftype !== "simple_resistor") {
    additionalPinLabels.push("-")
  }

  for (const port_hint of port.port_hints ?? []) {
    if (port_hint === mainPinName) continue
    if (isGenericPinHint(port_hint, port.pin_number)) continue
    if (component.ftype === "simple_chip") {
      additionalPinLabels.push(port_hint)
      continue
    }
    const score = scorePhrase(port_hint)
    if (score > 1) {
      additionalPinLabels.push(port_hint)
    }
  }

  const displayValue = component.display_value
    ? ` (${component.display_value})`
    : ""
  const uniqueAdditionalPinLabels = Array.from(new Set(additionalPinLabels))
  return `${component.name} ${mainPinName}${uniqueAdditionalPinLabels.length > 0 ? ` (${uniqueAdditionalPinLabels.join(",")})` : ""}${displayValue}`
}
