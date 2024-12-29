import type {
  CircuitJson,
  AnyCircuitElement,
  SourceNet,
  SourcePort,
} from "circuit-json"
import { su } from "@tscircuit/soup-util"
import { getFullConnectivityMapFromCircuitJson } from "circuit-json-to-connectivity-map"
import { generateNetName } from "./generateNetName"
import { getReadableNameForPin } from "./getReadableNameForPin"

export const convertCircuitJsonToReadableNetlist = (
  circuitJson: AnyCircuitElement[],
): string => {
  const connectivityMap = getFullConnectivityMapFromCircuitJson(
    circuitJson.filter((e) => e.type.startsWith("source_")),
  )
  const netMap = connectivityMap.netMap
  const source_ports = su(circuitJson).source_port.list()
  const source_components = su(circuitJson).source_component.list()
  const source_nets = su(circuitJson).source_net.list()
  const source_traces = su(circuitJson).source_trace.list()
  // Build readable netlist
  const netlist: string[] = []

  // Process each net
  for (const [netId, connectedIds] of Object.entries(netMap)) {
    // Get net name
    const net = source_nets.find((n) => connectedIds.includes(n.source_net_id))

    let netName = net?.name

    if (!netName) {
      // Generate a net name from the connected port names
      netName = generateNetName({ circuitJson, connectedIds })
    }

    const connectedPortCount = connectedIds.filter((id) =>
      id.startsWith("source_port"),
    ).length

    if (connectedPortCount <= 1) continue

    // Add net header
    netlist.push(`NET: ${netName}`)

    // Process connected components
    for (const id of connectedIds) {
      const pinName = getReadableNameForPin({
        circuitJson,
        source_port_id: id,
      })
      if (pinName) {
        netlist.push(`  - ${pinName}`)
      }
    }

    // Add blank line between nets
    netlist.push("")
  }

  // Process nets with only one connection
  let hasEmptyNets = false
  for (const [netId, connectedIds] of Object.entries(netMap)) {
    const connectedPortCount = connectedIds.filter((id) =>
      id.startsWith("source_port"),
    ).length
    if (connectedPortCount === 1) {
      if (!hasEmptyNets) {
        netlist.push("")
        netlist.push("EMPTY NET PINS:")
        hasEmptyNets = true
      }
      const source_port_id = netMap[netId].find((id) =>
        id.startsWith("source_port"),
      )!
      const pinName = getReadableNameForPin({
        circuitJson,
        source_port_id,
      })
      if (pinName) {
        netlist.push(`  - ${pinName}`)
      }
    }
  }

  return netlist.join("\n")
}
