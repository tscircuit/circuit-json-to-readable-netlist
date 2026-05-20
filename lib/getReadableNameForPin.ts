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
  "left",
  "right",
  "neg",
  "negative",
  "pos",
  "positive",
])

const isGenericPinName = (name: string) => /^pin\d+$/i.test(name)

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
  const addAdditionalPinLabel = (label: string) => {
    if (!label || label === mainPinName) return
    if (!additionalPinLabels.includes(label)) {
      additionalPinLabels.push(label)
    }
  }

  if (isPositive && component.ftype !== "simple_resistor") {
    addAdditionalPinLabel("+")
  } else if (isNegative && component.ftype !== "simple_resistor") {
    addAdditionalPinLabel("-")
  }

  for (const port_hint of port.port_hints ?? []) {
    const trimmedHint = port_hint.trim()
    if (!trimmedHint || trimmedHint === mainPinName) continue
    if (trimmedHint === String(port.pin_number)) continue
    const score = scorePhrase(trimmedHint)
    const shouldIncludeNumberedLabel =
      isGenericPinName(mainPinName) &&
      component.ftype !== "simple_resistor" &&
      component.ftype !== "simple_capacitor" &&
      !isGenericPinName(trimmedHint) &&
      !lowInformationPinHints.has(trimmedHint.toLowerCase())
    if (score > 1 || shouldIncludeNumberedLabel) {
      addAdditionalPinLabel(trimmedHint)
    }
  }

  const displayValue = component.display_value
    ? ` (${component.display_value})`
    : ""
  return `${component.name} ${mainPinName}${additionalPinLabels.length > 0 ? ` (${additionalPinLabels.join(",")})` : ""}${displayValue}`
}
