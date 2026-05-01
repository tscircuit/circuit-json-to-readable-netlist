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

  // Check if the port name is just a generic pin number label like "pin14"
  // Only replace generic names for chip-type components (not resistors/capacitors)
  const isGenericPinName =
    !port.name ||
    /^pin\d+$/i.test(port.name) ||
    port.name === String(port.pin_number)

  const isPassiveComponent =
    component.ftype === "simple_resistor" ||
    component.ftype === "simple_capacitor" ||
    component.ftype === "simple_inductor" ||
    component.ftype === "simple_diode"

  // For chips with generic pin names, find the best descriptive hint from port_hints
  const bestHint =
    isGenericPinName &&
    !isPassiveComponent &&
    port.port_hints &&
    port.port_hints.length > 0
      ? port.port_hints
          .filter(
            (h) =>
              h !== String(port.pin_number) && !/^pin\d+$/i.test(h),
          )
          .sort((a, b) => scorePhrase(b) - scorePhrase(a))[0]
      : null

  // Format pin description: prefer descriptive hint over generic "pin14" for chips
  const mainPinName = bestHint
    ? bestHint
    : port.name
      ? port.name
      : `pin${port.pin_number}`

  const additionalPinLabels: string[] = []

  if (isPositive && component.ftype !== "simple_resistor") {
    additionalPinLabels.push("+")
  } else if (isNegative && component.ftype !== "simple_resistor") {
    additionalPinLabels.push("-")
  }

  for (const port_hint of port.port_hints ?? []) {
    if (port_hint === mainPinName) continue
    if (port_hint === String(port.pin_number)) continue
    if (/^pin\d+$/i.test(port_hint) && port_hint !== mainPinName) continue
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
