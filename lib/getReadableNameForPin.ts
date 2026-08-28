import { su } from "@tscircuit/circuit-json-util"
import type {
  AnyCircuitElement,
  CircuitJson,
  SourceNet,
  SourcePort,
} from "circuit-json"
import { scorePhrase } from "./scorePhrase"

// Polarity/directional hints that should never be used as a main pin name.
// They are already represented by the +/- suffix, or are too generic.
const POLARITY_HINTS = new Set([
  "anode", "cathode", "pos", "neg", "positive", "negative", "left", "right",
])

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

  // When port.name is a generic "pin<N>" placeholder (e.g. from footprinter),
  // try to find a more descriptive name from port_hints (e.g. "GP14", "GPIO3").
  // Exclude polarity/directional hints — those are already shown as +/-.
  const isGenericPinName =
    port.name != null && /^pin\d+$/i.test(port.name)

  let mainPinName: string
  if (isGenericPinName && port.port_hints && port.port_hints.length > 0) {
    let bestHint: string | null = null
    let bestScore = -Infinity
    for (const hint of port.port_hints) {
      if (!hint) continue
      if (/^pin\d+$/i.test(hint)) continue  // skip generic pin<N>
      if (/^\d+$/.test(hint)) continue        // skip bare numbers
      if (POLARITY_HINTS.has(hint.toLowerCase())) continue  // skip polarity words
      const score = scorePhrase(hint)
      if (score > bestScore) {
        bestScore = score
        bestHint = hint
      }
    }
    // Accept any non-polarity hint that scores >= 0.5 (includes GP14 with digit score)
    mainPinName =
      bestHint != null && bestScore >= 0.5
        ? bestHint
        : (port.name ?? `Pin${port.pin_number}`)
  } else {
    mainPinName = port.name ? port.name : `Pin${port.pin_number}`
  }

  const additionalPinLabels: string[] = []
  if (isPositive && component.ftype !== "simple_resistor") {
    additionalPinLabels.push("+")
  } else if (isNegative && component.ftype !== "simple_resistor") {
    additionalPinLabels.push("-")
  }

  for (const port_hint of port.port_hints ?? []) {
    if (!port_hint) continue
    if (port_hint === mainPinName) continue
    // Skip generic pin<N> hints and bare digit strings
    if (/^pin\d+$/i.test(port_hint)) continue
    if (/^\d+$/.test(port_hint)) continue
    const score = scorePhrase(port_hint)
    if (score > 1) {
      additionalPinLabels.push(port_hint)
    }
  }

  const displayValue = component.display_value
    ? ` (${component.display_value})`
    : ""

  return `${component.name} ${mainPinName}${additionalPinLabels.length > 0 ? ` (${additionalPinLabels.join(",")})` : ""}${displayValue}`
}
