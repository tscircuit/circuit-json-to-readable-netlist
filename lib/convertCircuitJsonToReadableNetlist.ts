import type {
  CircuitJson,
  AnyCircuitElement,
  SourceNet,
  SourcePort,
} from "circuit-json"
import { su } from "@tscircuit/soup-util"
import { getFullConnectivityMapFromCircuitJson } from "circuit-json-to-connectivity-map"

/*
declare class ConnectivityMap {
    netMap: Record<string, string[]>;
    idToNetMap: Record<string, string>;
    constructor(netMap: Record<string, string[]>);
    addConnections(connections: string[][]): void;
    getIdsConnectedToNet(netId: string): string[];
    getNetConnectedToId(id: string): string | undefined;
    areIdsConnected(id1: string, id2: string): boolean;
    areAllIdsConnected(ids: string[]): boolean;
}
*/

export const convertCircuitJsonToReadableNetlist = (
  circuitJson: AnyCircuitElement[],
): string => {
  const connectivityMap = getFullConnectivityMapFromCircuitJson(circuitJson)
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
    const net = source_nets.find((n) => n.source_net_id === netId)
    const netName = net?.name || netId

    // Add net header
    netlist.push(`NET: ${netName}`)

    // Process connected components
    for (const id of connectedIds) {
      // Find the port
      const port = source_ports.find((p) => p.source_port_id === id)
      if (!port) continue

      // Find the component this port belongs to
      const component = source_components.find(
        (c) => c.source_component_id === port.source_component_id,
      )
      if (!component) continue

      // Add component connection line
      const pinInfo = port.pin_number ? `Pin${port.pin_number}` : port.name
      const displayValue = component.display_value
        ? ` (${component.display_value})`
        : ""
      netlist.push(`  - ${component.name} ${pinInfo}${displayValue}`)
    }

    // Add blank line between nets
    netlist.push("")
  }

  return netlist.join("\n")
}
