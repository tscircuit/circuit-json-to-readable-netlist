import { su } from "@tscircuit/soup-util"
import type {
  AnyCircuitElement,
  CircuitJson,
  SourceNet,
  SourcePort,
} from "circuit-json"
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

  // Add COMPONENTS section
  netlist.push("COMPONENTS:")
  for (const component of source_components) {
    let componentDescription = ""

    // Get the cad_component associated with the source_component
    const cadComponent = su(circuitJson).cad_component.getWhere({
      source_component_id: component.source_component_id,
    })

    const footprint = cadComponent?.footprinter_string

    if (component.ftype === "simple_resistor") {
      componentDescription = `${component.display_resistance} ${footprint} resistor`
    } else if (component.ftype === "simple_capacitor") {
      componentDescription = `${component.display_capacitance} ${footprint} capacitor`
    } else if (component.ftype === "simple_chip") {
      const manufacturerPartNumber = component.manufacturer_part_number
      componentDescription = `${manufacturerPartNumber}, ${footprint}`
    } else {
      componentDescription = `${component.name}, ${component.type}`
    }

    netlist.push(` - ${component.name}: ${componentDescription}`)
  }
  netlist.push("")

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

  // build map of port ids to the nets they connect to
  const portIdToNetNames: Record<string, string[]> = {}
  for (const [netId, connectedIds] of Object.entries(netMap)) {
    const portIds = connectedIds.filter((id) => id.startsWith("source_port"))
    if (portIds.length === 0) continue
    const net = source_nets.find((n) => connectedIds.includes(n.source_net_id))
    let netName = net?.name
    if (!netName) {
      netName = generateNetName({ circuitJson, connectedIds })
    }
    for (const portId of portIds) {
      if (!portIdToNetNames[portId]) portIdToNetNames[portId] = []
      portIdToNetNames[portId].push(netName)
    }
  }

  if (source_components.length > 0) {
    netlist.push("")
    netlist.push("COMPONENT_PINS:")
    for (const component of source_components) {
      const cadComponent = su(circuitJson).cad_component.getWhere({
        source_component_id: component.source_component_id,
      })
      const footprint = cadComponent?.footprinter_string
      let header = component.name
      if (component.ftype === "simple_resistor") {
        header = `${component.name} (${component.display_resistance} ${footprint})`
      } else if (component.ftype === "simple_capacitor") {
        header = `${component.name} (${component.display_capacitance} ${footprint})`
      } else if (component.manufacturer_part_number) {
        header = `${component.name} (${component.manufacturer_part_number})`
      }
      netlist.push(header)
      const ports = source_ports
        .filter((p) => p.source_component_id === component.source_component_id)
        .sort((a, b) => (a.pin_number ?? 0) - (b.pin_number ?? 0))
      for (const port of ports) {
        const mainPin =
          port.pin_number !== undefined ? `pin${port.pin_number}` : port.name
        const aliases: string[] = []
        if (port.name && port.name !== mainPin) aliases.push(port.name)
        for (const hint of port.port_hints ?? []) {
          if (hint === String(port.pin_number)) continue
          if (hint !== mainPin && hint !== port.name) aliases.push(hint)
        }
        const aliasPart =
          aliases.length > 0
            ? `(${Array.from(new Set(aliases)).join(", ")})`
            : ""
        const nets = portIdToNetNames[port.source_port_id] ?? []
        const netsPart =
          nets.length > 0 ? `NETS(${nets.join(", ")})` : "NOT_CONNECTED"
        netlist.push(`- ${mainPin}${aliasPart}: ${netsPart}`)
      }
      netlist.push("")
    }
  }

  return netlist.join("\n")
}
