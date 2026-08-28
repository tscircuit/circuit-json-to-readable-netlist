import { su } from "@tscircuit/circuit-json-util"
import type { AnyCircuitElement } from "circuit-json"
import { scorePhrase } from "./scorePhrase"

const isGenericPinLabel = (label: string | undefined, pinNumber?: number) => {
  if (!label) return false
  const normalized = label.toLowerCase()
  return (
    normalized === "pin" ||
    normalized === `pin${pinNumber}` ||
    normalized === String(pinNumber) ||
    /^pin\d+$/i.test(label)
  )
}

const getBestDescriptivePinName = ({
  name,
  portHints,
  pinNumber,
  preferDescriptiveHints,
}: {
  name?: string
  portHints?: string[]
  pinNumber?: number
  preferDescriptiveHints: boolean
}) => {
  if (name && !isGenericPinLabel(name, pinNumber)) return name
  if (!preferDescriptiveHints) return undefined

  return [...new Set(portHints ?? [])].find(
    (hint) => !isGenericPinLabel(hint, pinNumber),
  )
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
  const fallbackPinName =
    port.pin_number !== undefined ? `pin${port.pin_number}` : port.name
  const mainPinName =
    getBestDescriptivePinName({
      name: port.name,
      portHints: port.port_hints,
      pinNumber: port.pin_number,
      preferDescriptiveHints: component.ftype === "simple_chip",
    }) ??
    fallbackPinName ??
    "pin"

  const additionalPinLabels: string[] = []

  if (
    isGenericPinLabel(port.name, port.pin_number) &&
    port.name !== mainPinName
  ) {
    additionalPinLabels.push(port.name)
  }

  if (isPositive && component.ftype !== "simple_resistor") {
    additionalPinLabels.push("+")
  } else if (isNegative && component.ftype !== "simple_resistor") {
    additionalPinLabels.push("-")
  }

  for (const port_hint of port.port_hints ?? []) {
    if (port_hint === mainPinName) continue
    if (port_hint === port.name) continue
    if (port_hint === String(port.pin_number)) continue
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
