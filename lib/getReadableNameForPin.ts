import { su } from "@tscircuit/circuit-json-util"
import type {
  AnyCircuitElement,
  CircuitJson,
  SourceNet,
  SourcePort,
} from "circuit-json"
import { scorePhrase } from "./scorePhrase"

const isGenericPinLabel = (label: string, pinNumber?: number) => {
  const normalizedLabel = label.trim().toLowerCase()
  return (
    normalizedLabel === String(pinNumber) ||
    normalizedLabel === `pin${pinNumber}` ||
    /^pin\d+$/i.test(normalizedLabel)
  )
}

const getBestMainPinLabel = (port: SourcePort): string => {
  const fallbackLabel =
    port.name || (port.pin_number !== undefined ? `Pin${port.pin_number}` : "")
  const labels = Array.from(
    new Set([...(port.name ? [port.name] : []), ...(port.port_hints ?? [])]),
  ).filter(Boolean)

  if (port.name && !isGenericPinLabel(port.name, port.pin_number)) {
    return port.name
  }

  const readableLabels = labels.filter(
    (label) => !isGenericPinLabel(label, port.pin_number),
  )
  if (readableLabels.length === 0) return fallbackLabel

  return readableLabels.sort((a, b) => scorePhrase(b) - scorePhrase(a))[0]
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

  // Prefer semantic labels over generated chip names such as "pin14".
  const mainPinName =
    component.ftype === "simple_chip"
      ? getBestMainPinLabel(port)
      : port.name
        ? port.name
        : `Pin${port.pin_number}`

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
      (component.ftype === "simple_chip" &&
        !isGenericPinLabel(port_hint, port.pin_number))
    ) {
      additionalPinLabels.push(port_hint)
    }
  }

  const displayValue = component.display_value
    ? ` (${component.display_value})`
    : ""
  return `${component.name} ${mainPinName}${additionalPinLabels.length > 0 ? ` (${additionalPinLabels.join(",")})` : ""}${displayValue}`
}
