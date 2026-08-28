import { su } from "@tscircuit/circuit-json-util"
import type {
  AnyCircuitElement,
  CircuitJson,
  SourceNet,
  SourcePort,
} from "circuit-json"
import { scorePhrase } from "./scorePhrase"

const isGenericPinName = (name: string | undefined): boolean =>
  Boolean(name?.match(/^pin\d+$/i))

const isPinNumberHint = (
  hint: string,
  pinNumber: number | string | undefined,
): boolean => {
  if (pinNumber === undefined) return false
  return hint === String(pinNumber) || hint.toLowerCase() === `pin${pinNumber}`
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

  const bestPinHint = port.port_hints?.find(
    (hint) => !isPinNumberHint(hint, port.pin_number),
  )

  // Determine pin polarity from hints
  const isPositive = port.port_hints?.some((hint) =>
    ["anode", "pos", "positive"].includes(hint.toLowerCase()),
  )
  const isNegative = port.port_hints?.some((hint) =>
    ["cathode", "neg", "negative"].includes(hint.toLowerCase()),
  )

  // Format pin description
  const mainPinName =
    port.name && !isGenericPinName(port.name)
      ? port.name
      : (bestPinHint ?? port.name ?? `Pin${port.pin_number}`)

  const additionalPinLabels: string[] = []

  if (port.name && port.name !== mainPinName) {
    additionalPinLabels.push(port.name)
  }

  if (isPositive && component.ftype !== "simple_resistor") {
    additionalPinLabels.push("+")
  } else if (isNegative && component.ftype !== "simple_resistor") {
    additionalPinLabels.push("-")
  }

  for (const port_hint of port.port_hints ?? []) {
    if (port_hint === mainPinName) continue
    const score = scorePhrase(port_hint)
    if (score > 1) {
      additionalPinLabels.push(port_hint)
    }
  }

  const displayValue = component.display_value
    ? ` (${component.display_value})`
    : ""
  const uniqueAdditionalLabels = Array.from(new Set(additionalPinLabels))
  return `${component.name} ${mainPinName}${uniqueAdditionalLabels.length > 0 ? ` (${uniqueAdditionalLabels.join(",")})` : ""}${displayValue}`
}
