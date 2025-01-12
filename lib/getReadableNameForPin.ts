import type {
  CircuitJson,
  AnyCircuitElement,
  SourceNet,
  SourcePort,
} from "circuit-json"
import { su } from "@tscircuit/soup-util"
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
  const source_traces = su(circuitJson).source_trace.list()
  const source_nets = su(circuitJson).source_net.list()

  // Handle trace ports
  if (source_port_id.startsWith("source_trace_")) {
    const traceId = source_port_id.replace("source_trace_", "")
    const trace = source_traces.find((t) => t.source_trace_id === traceId)
    if (trace && trace.connected_source_port_ids) {
      // Try to get a readable name from any of the connected ports
      for (const connectedPortId of trace.connected_source_port_ids) {
        const result = getReadableNameForPin({
          circuitJson,
          source_port_id: connectedPortId,
        })
        if (result) return result
      }
    }
    return `[UNRESOLVED_PORT: ${source_port_id}]`
  }

  // Handle net ports
  if (source_port_id.startsWith("source_net_")) {
    const netId = source_port_id.replace("source_net_", "")
    const net = source_nets.find((n) => n.source_net_id === netId)
    if (net && net.name) return net.name
    return `[UNRESOLVED_PORT: ${source_port_id}]`
  }

  const port = source_ports.find(
    (p: SourcePort) => p.source_port_id === source_port_id,
  )
  if (!port) return `[UNRESOLVED_PORT: ${source_port_id}]`

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

  let mainPinName = port.name

  // Special handling for PICO_W pins - preserve descriptive names
  if (
    component.manufacturer_part_number === "PICO_W" &&
    port.name &&
    port.name.match(/^(GP\d+_|GND\d+|VBUS)/)
  ) {
    mainPinName = port.name
  } else if (!mainPinName && port.port_hints && port.port_hints.length > 0) {
    // Try to find the most descriptive hint (highest score)
    const scoredHints = port.port_hints
      .map((hint: string) => ({ hint, score: scorePhrase(hint) }))
      .sort(
        (
          a: { hint: string; score: number },
          b: { hint: string; score: number },
        ) => b.score - a.score,
      )
    if (scoredHints.length > 0) {
      mainPinName = scoredHints[0].hint
    }
  }
  if (!mainPinName) {
    // If we still don't have a name, use pin number default
    mainPinName = `${component.ftype === "simple_chip" ? "GPIO" : "Pin"}${port.pin_number}`
  }

  const additionalPinLabels: string[] = []

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
  return `${component.name} ${mainPinName}${additionalPinLabels.length > 0 ? ` (${additionalPinLabels.join(",")})` : ""}${displayValue}`
}
