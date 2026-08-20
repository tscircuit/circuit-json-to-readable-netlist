import { su } from "@tscircuit/circuit-json-util"
import type {
  AnyCircuitElement,
  CircuitJson,
  SourceNet,
  SourcePort,
} from "circuit-json"
import { scorePhrase } from "./scorePhrase"

const lowInformationPinHints = new Set([
  "anode",
  "cathode",
  "neg",
  "negative",
  "pos",
  "positive",
  "left",
  "right",
])

const isGenericPinLabel = (label: string) =>
  /^pin\d+$/i.test(label) || /^\d+$/.test(label)

const hasTechnicalPinName = (label: string) => /[A-Z]/.test(label)

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
  const mainPinIsGeneric = isGenericPinLabel(mainPinName)

  const additionalPinLabels: string[] = []

  if (isPositive && component.ftype !== "simple_resistor") {
    additionalPinLabels.push("+")
  } else if (isNegative && component.ftype !== "simple_resistor") {
    additionalPinLabels.push("-")
  }

  for (const port_hint of port.port_hints ?? []) {
    const pinLabel = port_hint.trim()
    if (!pinLabel) continue
    if (pinLabel === mainPinName) continue
    if (isGenericPinLabel(pinLabel)) continue
    if (lowInformationPinHints.has(pinLabel.toLowerCase())) continue

    const score = scorePhrase(pinLabel)
    if (score > 1 || (mainPinIsGeneric && hasTechnicalPinName(pinLabel))) {
      additionalPinLabels.push(pinLabel)
    }
  }

  const displayValue = component.display_value
    ? ` (${component.display_value})`
    : ""
  return `${component.name} ${mainPinName}${additionalPinLabels.length > 0 ? ` (${additionalPinLabels.join(",")})` : ""}${displayValue}`
}
