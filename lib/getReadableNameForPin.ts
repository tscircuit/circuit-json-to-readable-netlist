import { su } from "@tscircuit/circuit-json-util"
import type { AnyCircuitElement, SourcePort } from "circuit-json"

export const getReadablePinLabel = (port: SourcePort): string => {
  const mainPinName =
    port.pin_number !== undefined
      ? `pin${port.pin_number}`
      : (port.name ?? "pin")

  const aliases: string[] = []
  if (port.name && port.name !== mainPinName) aliases.push(port.name)

  for (const portHint of port.port_hints ?? []) {
    if (portHint === String(port.pin_number)) continue
    if (portHint !== mainPinName && portHint !== port.name) {
      aliases.push(portHint)
    }
  }

  const uniqueAliases = Array.from(new Set(aliases))
  const aliasPart =
    uniqueAliases.length > 0 ? `(${uniqueAliases.join(", ")})` : ""

  return `${mainPinName}${aliasPart}`
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

  const mainPinName = port.name ? port.name : `Pin${port.pin_number}`
  let pinLabel = getReadablePinLabel(port)

  if (component.ftype === "simple_resistor") {
    pinLabel = mainPinName
  } else if (component.ftype === "simple_capacitor") {
    const isPositive = port.port_hints?.some((hint) =>
      ["anode", "pos", "positive"].includes(hint.toLowerCase()),
    )
    const isNegative = port.port_hints?.some((hint) =>
      ["cathode", "neg", "negative"].includes(hint.toLowerCase()),
    )
    pinLabel = `${mainPinName}${isPositive ? " (+)" : isNegative ? " (-)" : ""}`
  }

  const displayValue = component.display_value
    ? ` (${component.display_value})`
    : ""
  return `${component.name} ${pinLabel}${displayValue}`
}
