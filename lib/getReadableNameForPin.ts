import { su } from "@tscircuit/circuit-json-util"
import type {
  AnyCircuitElement,
  CircuitJson,
  SourceNet,
  SourcePort,
} from "circuit-json"
import { scorePhrase } from "./scorePhrase"

const normalizePinHint = (hint: string) => hint.trim()

const isGenericPinHint = (hint: string) =>
  ["anode", "cathode", "pos", "neg", "positive", "negative"].includes(
    normalizePinHint(hint).toLowerCase(),
  )

const isPinNumberName = (name: string, pin_number: number | undefined) => {
  const normalizedName = normalizePinHint(name).toLowerCase()
  if (/^\d+$/.test(normalizedName)) return true
  if (pin_number === undefined) return /^pin\d+$/.test(normalizedName)
  return (
    normalizedName === String(pin_number) ||
    normalizedName === `pin${pin_number}`
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
    ["anode", "pos", "positive"].includes(normalizePinHint(hint).toLowerCase()),
  )
  const isNegative = port.port_hints?.some((hint) =>
    ["cathode", "neg", "negative"].includes(
      normalizePinHint(hint).toLowerCase(),
    ),
  )

  // Format pin description
  const mainPinName = port.name ? port.name : `Pin${port.pin_number}`

  const additionalPinLabels: string[] = []

  if (isPositive && component.ftype !== "simple_resistor") {
    additionalPinLabels.push("+")
  } else if (isNegative && component.ftype !== "simple_resistor") {
    additionalPinLabels.push("-")
  }

  const allowLowScoreChipHint =
    component.ftype === "simple_chip" &&
    isPinNumberName(mainPinName, port.pin_number)

  for (const raw_port_hint of port.port_hints ?? []) {
    const port_hint = normalizePinHint(raw_port_hint)
    const normalized_port_hint = port_hint.toLowerCase()
    if (port_hint === "") continue
    if (normalized_port_hint === normalizePinHint(mainPinName).toLowerCase())
      continue
    if (normalized_port_hint === String(port.pin_number)) continue
    if (normalized_port_hint === `pin${port.pin_number}`) continue
    if (isGenericPinHint(port_hint)) continue
    const score = scorePhrase(port_hint)
    if (score > 1 || allowLowScoreChipHint) {
      additionalPinLabels.push(port_hint)
    }
  }

  const displayValue = component.display_value
    ? ` (${component.display_value})`
    : ""
  return `${component.name} ${mainPinName}${additionalPinLabels.length > 0 ? ` (${Array.from(new Set(additionalPinLabels)).join(",")})` : ""}${displayValue}`
}
