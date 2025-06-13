import { su } from "@tscircuit/circuit-json-util"
import type { AnyCircuitElement, AnySourceComponent } from "circuit-json"
import { getReadableNameForPin } from "./getReadableNameForPin"
import { scorePhrase } from "./scorePhrase"

// Order components by how much better they are as a reference (chips are
// better than capacitors, caps are better than resistors)
const scoreComponentOrder = (component: AnySourceComponent) => {
  if (!("ftype" in component)) return 0
  if (component.ftype === "simple_resistor") return 0
  if (component.ftype === "simple_capacitor") return 1
  return 2
}

export const generateNetName = ({
  circuitJson,
  connectedIds,
}: {
  circuitJson: AnyCircuitElement[]
  connectedIds: string[]
}): string => {
  const all_source_components = su(circuitJson).source_component.list()
  const sourceComponentIdToScore = new Map()
  for (const component of all_source_components) {
    sourceComponentIdToScore.set(
      component.source_component_id,
      scoreComponentOrder(component),
    )
  }
  all_source_components.sort(
    (a, b) =>
      sourceComponentIdToScore.get(b.source_component_id) -
      sourceComponentIdToScore.get(a.source_component_id),
  )

  const all_source_ports = su(circuitJson)
    .source_port.list()
    .sort(
      (a, b) =>
        sourceComponentIdToScore.get(b.source_component_id) -
        sourceComponentIdToScore.get(a.source_component_id),
    )

  const all_source_nets = su(circuitJson).source_net.list()
  const all_source_traces = su(circuitJson).source_trace.list()

  const ports = all_source_ports.filter((p) =>
    connectedIds.includes(p.source_port_id),
  )
  const nets = all_source_nets.filter((n) =>
    connectedIds.includes(n.source_net_id),
  )
  const traces = all_source_traces.filter((t) =>
    connectedIds.includes(t.source_trace_id),
  )

  const possibleNames = ports
    .flatMap((p) =>
      Array.from(
        new Set([...(p.name ? [p.name] : []), ...(p.port_hints ?? [])]),
      ),
    )
    .concat(nets.map((n) => n.name))

  const phrases = possibleNames.map((name) => ({
    name,
    score: scorePhrase(name),
  }))

  const bestPortName = phrases.sort((a, b) => b.score - a.score)[0].name

  // Find the component that has the best port name
  const bestPort = ports.find(
    (p) => p.name === bestPortName || p.port_hints?.includes(bestPortName),
  )

  const componentWithBestPort = all_source_components.find(
    (c) => c.source_component_id === bestPort?.source_component_id,
  )
  return [componentWithBestPort?.name, bestPortName].filter(Boolean).join("_")
}
