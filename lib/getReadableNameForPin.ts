import { su } from "@tscircuit/circuit-json-util"
import type {
  AnyCircuitElement,
  CircuitJson,
  SourceNet,
  SourcePort,
} from "circuit-json"
import { scorePhrase } from "./scorePhrase"

const isGenericPinLabel = (label: string) => /^pin\d+$/i.test(label.trim())

const hasLettersAndDigits = (value: string) =>
  /[a-z]/i.test(value) && /\d/.test(value)

export const getPreferredPinLabel = (port: SourcePort): string => {
  const name = port.name?.trim()
  const hints = (port.port_hints ?? []).map((h) => h.trim()).filter(Boolean)

  if (name && !isGenericPinLabel(name)) {
    return name
  }

  const descriptiveHints = hints.filter((hint) => !isGenericPinLabel(hint))
  const alphanumericHint = descriptiveHints.find(hasLettersAndDigits)
  if (alphanumericHint) return alphanumericHint

  if (descriptiveHints.length > 0) return descriptiveHints[0]
  if (name) return name
  if (port.pin_number !== undefined) return `pin${port.pin_number}`
  return "pin"
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
  const mainPinName = getPreferredPinLabel(port)

  const additionalPinLabels: string[] = []

  if (isPositive && component.ftype !== "simple_resistor") {
    additionalPinLabels.push("+")
  } else if (isNegative && component.ftype !== "simple_resistor") {
    additionalPinLabels.push("-")
  }

  for (const port_hint of port.port_hints ?? []) {
    if (port_hint === mainPinName) continue
    if (isGenericPinLabel(port_hint)) continue
    const score = scorePhrase(port_hint)
    if (score > 1 || hasLettersAndDigits(port_hint)) {
      additionalPinLabels.push(port_hint)
    }
  }

  const displayValue = component.display_value
    ? ` (${component.display_value})`
    : ""
  return `${component.name} ${mainPinName}${additionalPinLabels.length > 0 ? ` (${additionalPinLabels.join(",")})` : ""}${displayValue}`
}
