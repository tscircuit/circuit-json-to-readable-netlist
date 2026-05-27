import { su } from "@tscircuit/circuit-json-util"
import type { AnyCircuitElement, SourcePort } from "circuit-json"
import { scorePhrase } from "./scorePhrase"

const isGenericPinLabel = (
  label: string | undefined,
  pinNumber: number | undefined,
) => {
  if (!label) return true
  if (pinNumber === undefined) return false

  const normalizedLabel = label.toLowerCase()

  return normalizedLabel === `pin${pinNumber}` || label === String(pinNumber)
}

const isSpecificPinLabel = (
  label: string | undefined,
  pinNumber: number | undefined,
) => {
  if (!label || isGenericPinLabel(label, pinNumber)) return false

  return scorePhrase(label) > 1 || (/[a-z]/i.test(label) && /\d/.test(label))
}

const getMainPinName = (port: SourcePort) => {
  if (!isGenericPinLabel(port.name, port.pin_number)) {
    return port.name
  }

  const bestHint = port.port_hints?.find((hint) =>
    isSpecificPinLabel(hint, port.pin_number),
  )

  return bestHint ?? port.name ?? `Pin${port.pin_number}`
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
  const mainPinName = getMainPinName(port)

  const additionalPinLabels: string[] = []

  if (isPositive && component.ftype !== "simple_resistor") {
    additionalPinLabels.push("+")
  } else if (isNegative && component.ftype !== "simple_resistor") {
    additionalPinLabels.push("-")
  }

  for (const port_hint of port.port_hints ?? []) {
    if (port_hint === mainPinName) continue
    if (isSpecificPinLabel(port_hint, port.pin_number)) {
      additionalPinLabels.push(port_hint)
    }
  }

  const displayValue = component.display_value
    ? ` (${component.display_value})`
    : ""
  return `${component.name} ${mainPinName}${additionalPinLabels.length > 0 ? ` (${additionalPinLabels.join(",")})` : ""}${displayValue}`
}
