import { su } from "@tscircuit/circuit-json-util"
import type {
  AnyCircuitElement,
  CircuitJson,
  SourceNet,
  SourcePort,
} from "circuit-json"
import { scorePhrase } from "./scorePhrase"

const isGenericPinLabel = (label: string) => /^pin\d+$/i.test(label)

const hasLettersAndNumbers = (hint: string) =>
  /[a-z]/i.test(hint) && /\d/.test(hint)

const isMeaningfulPinHint = (hint: string, score: number) =>
  !isGenericPinLabel(hint) &&
  !/^\d+$/.test(hint) &&
  (score >= 1 || hasLettersAndNumbers(hint))

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
  const mainPinNameIsGeneric = isGenericPinLabel(mainPinName)

  const additionalPinLabels: string[] = []

  if (isPositive && component.ftype !== "simple_resistor") {
    additionalPinLabels.push("+")
  } else if (isNegative && component.ftype !== "simple_resistor") {
    additionalPinLabels.push("-")
  }

  for (const port_hint of port.port_hints ?? []) {
    if (port_hint === mainPinName) continue
    const score = scorePhrase(port_hint)
    if (
      score > 1 ||
      (mainPinNameIsGeneric && isMeaningfulPinHint(port_hint, score))
    ) {
      additionalPinLabels.push(port_hint)
    }
  }

  const displayValue = component.display_value
    ? ` (${component.display_value})`
    : ""
  const uniquePinLabels = Array.from(new Set(additionalPinLabels))
  return `${component.name} ${mainPinName}${uniquePinLabels.length > 0 ? ` (${uniquePinLabels.join(",")})` : ""}${displayValue}`
}
