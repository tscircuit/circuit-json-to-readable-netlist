import { su } from "@tscircuit/circuit-json-util"
import type {
  AnyCircuitElement,
  CircuitJson,
  SourceNet,
  SourcePort,
} from "circuit-json"
import { scorePhrase } from "./scorePhrase"

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
  const mainPinName = port.name
    ? port.name
    : port.pin_number !== undefined
      ? `Pin${port.pin_number}`
      : "unnamed"

  const additionalPinLabels: string[] = []

  if (isPositive && component.ftype !== "simple_resistor") {
    additionalPinLabels.push("+")
  } else if (isNegative && component.ftype !== "simple_resistor") {
    additionalPinLabels.push("-")
  }

  const polaritiesAndDirections = new Set([
    "anode",
    "cathode",
    "pos",
    "neg",
    "positive",
    "negative",
    "left",
    "right",
    "top",
    "bottom",
  ])

  for (const port_hint of port.port_hints ?? []) {
    if (!port_hint) continue
    const normalizedHint = port_hint.toLowerCase()

    // Skip if hint is exactly equal to mainPinName (case insensitive)
    if (normalizedHint === mainPinName.toLowerCase()) continue

    // Skip if hint is just the pin number
    if (
      port.pin_number !== undefined &&
      normalizedHint === String(port.pin_number)
    )
      continue

    // Skip if hint is generic "pin" + pin number
    if (
      port.pin_number !== undefined &&
      normalizedHint === `pin${port.pin_number}`
    )
      continue

    // Skip if hint is a polarity or direction
    if (polaritiesAndDirections.has(normalizedHint)) continue

    // Skip if hint is just a number
    if (/^\d+$/.test(port_hint)) continue

    // Skip duplicates
    if (additionalPinLabels.includes(port_hint)) continue

    additionalPinLabels.push(port_hint)
  }

  const displayValue = component.display_value
    ? ` (${component.display_value})`
    : ""
  return `${component.name} ${mainPinName}${
    additionalPinLabels.length > 0 ? ` (${additionalPinLabels.join(",")})` : ""
  }${displayValue}`
}
