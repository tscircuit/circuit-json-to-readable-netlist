import { su } from "@tscircuit/circuit-json-util"
import type { AnyCircuitElement } from "circuit-json"
import { getFullConnectivityMapFromCircuitJson } from "circuit-json-to-connectivity-map"
import { generateNetName } from "./generateNetName"
import { getReadableNameForPin } from "./getReadableNameForPin"
import { cleanLabel } from "./pin-labels"

const formatLabelParts = (...parts: Array<string | undefined | null>) =>
  parts.map(cleanLabel).filter(Boolean).join(" ")

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
  const netlist: string[] = []

  netlist.push("COMPONENTS:")
  for (const component of source_components) {
    let componentDescription = ""
    const cadComponent = su(circuitJson).cad_component.getWhere({
      source_component_id: component.source_component_id,
    })
    const footprint = cadComponent?.footprinter_string

    if (component.ftype === "simple_resistor") {
      componentDescription = formatLabelParts(
        component.display_resistance,
        footprint,
        "resistor",
      )
    } else if (component.ftype === "simple_capacitor") {
      componentDescription = formatLabelParts(
        component.display_capacitance,
        footprint,
        "capacitor",
      )
    } else if (component.ftype === "simple_chip") {
      const manufacturerPartNumber = component.manufacturer_part_number
      componentDescription = [manufacturerPartNumber, footprint]
        .filter(Boolean)
        .join(", ")
    } else {
      componentDescription = [component.name, component.type]
        .filter(Boolean)
        .join(", ")
    }

    netlist.push(` - ${component.name}: ${componentDescription}`)
  }
  netlist.push("")

  for (const connectedIds of Object.values(netMap)) {
    const net = source_nets.find((n) => connectedIds.includes(n.source_net_id))
    let netName = cleanLabel(net?.name)
    if (!netName) {
      netName = generateNetName({ circuitJson, connectedIds })
    }

    const connectedPortCount = connectedIds.filter((id) =>
      id.startsWith("source_port"),
    ).length
    if (connectedPortCount <= 1) continue

    netlist.push(`NET: ${netName}`)
    for (const id of connectedIds) {
      const pinName = getReadableNameForPin({
        circuitJson,
        source_port_id: id,
      })
      if (pinName) {
        netlist.push(`  - ${pinName}`)
      }
    }
    netlist.push("")
  }

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

  const portIdToNetNames: Record<string, string[]> = {}
  for (const connectedIds of Object.values(netMap)) {
    const portIds = connectedIds.filter((id) => id.startsWith("source_port"))
    if (portIds.length === 0) continue
    const net = source_nets.find((n) => connectedIds.includes(n.source_net_id))
    let netName = cleanLabel(net?.name)
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
        const details = formatLabelParts(
          component.display_resistance,
          footprint,
        )
        header = details ? `${component.name} (${details})` : component.name
      } else if (component.ftype === "simple_capacitor") {
        const details = formatLabelParts(
          component.display_capacitance,
          footprint,
        )
        header = details ? `${component.name} (${details})` : component.name
      } else if (component.manufacturer_part_number) {
        header = `${component.name} (${component.manufacturer_part_number})`
      }
      netlist.push(header)
      const ports = source_ports
        .filter((p) => p.source_component_id === component.source_component_id)
        .sort((a, b) => (a.pin_number ?? 0) - (b.pin_number ?? 0))
      for (const port of ports) {
        const portName = cleanLabel(port.name)
        const mainPin =
          port.pin_number !== undefined ? `pin${port.pin_number}` : portName
        const aliases: string[] = []
        if (portName && portName !== mainPin) aliases.push(portName)
        for (const hint of port.port_hints ?? []) {
          const cleanHint = cleanLabel(hint)
          if (!cleanHint) continue
          if (cleanHint === String(port.pin_number)) continue
          if (cleanHint !== mainPin && cleanHint !== portName) {
            aliases.push(cleanHint)
          }
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
