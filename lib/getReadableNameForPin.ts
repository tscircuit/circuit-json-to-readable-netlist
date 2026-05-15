import { su } from "@tscircuit/circuit-json-util"
import type {
  AnyCircuitElement,
  CircuitJson,
  SourceNet,
  SourcePort,
} from "circuit-json"
import { scorePhrase } from "./scorePhrase"

const isGenericPinName = (name?: string) => /^pin\d+$/i.test(name ?? "")

const isPinNumberHint = (hint: string, port: SourcePort) =>
  port.pin_number !== undefined && hint === String(port.pin_number)

const uniqueLabels = (labels: string[]) => Array.from(new Set(labels))

export const getBestReadablePinLabel = (port: SourcePort): string => {
  const fallback =
    port.name || (port.pin_number !== undefined ? `pin${port.pin_number}` : "")

  if (port.name && !isGenericPinName(port.name)) return port.name

  const bestHint = (port.port_hints ?? []).find(
    (hint) =>
      !isGenericPinName(hint) &&
      !isPinNumberHint(hint, port) &&
      scorePhrase(hint) >= 1,
  )

  return bestHint ?? fallback
}

export const getReadablePinAliases = (port: SourcePort, mainPin: string) => {
  const aliases: string[] = []
  const numberedPin =
    port.pin_number !== undefined ? `pin${port.pin_number}` : undefined
  const addAlias = (label?: string) => {
    if (!label || label === mainPin) return
    aliases.push(label)
  }

  addAlias(numberedPin)
  addAlias(port.name)
  for (const hint of port.port_hints ?? []) {
    if (isPinNumberHint(hint, port)) continue
    addAlias(hint)
  }

  return uniqueLabels(aliases)
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
    ["anode", "pos", "positive"].includes(hint.toLowerCase()),
  )
  const isNegative = port.port_hints?.some((hint) =>
    ["cathode", "neg", "negative"].includes(hint.toLowerCase()),
  )

  // Format pin description
  const mainPinName = getBestReadablePinLabel(port)

  const additionalPinLabels: string[] = []

  if (isPositive && component.ftype !== "simple_resistor") {
    additionalPinLabels.push("+")
  } else if (isNegative && component.ftype !== "simple_resistor") {
    additionalPinLabels.push("-")
  }

  if (port.name && isGenericPinName(port.name) && port.name !== mainPinName) {
    additionalPinLabels.push(port.name)
  }

  for (const port_hint of port.port_hints ?? []) {
    if (port_hint === mainPinName) continue
    if (isPinNumberHint(port_hint, port)) continue
    const score = scorePhrase(port_hint)
    if (score >= 1) {
      additionalPinLabels.push(port_hint)
    }
  }

  const displayValue = component.display_value
    ? ` (${component.display_value})`
    : ""
  return `${component.name} ${mainPinName}${additionalPinLabels.length > 0 ? ` (${additionalPinLabels.join(",")})` : ""}${displayValue}`
}
