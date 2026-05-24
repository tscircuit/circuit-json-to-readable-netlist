import { su } from "@tscircuit/circuit-json-util"
import type {
  AnyCircuitElement,
  CircuitJson,
  SourceNet,
  SourcePort,
} from "circuit-json"
import { scorePhrase } from "./scorePhrase"

const nonPrimaryPinLabels = new Set([
  "anode",
  "cathode",
  "left",
  "neg",
  "negative",
  "pos",
  "positive",
  "right",
])

const getPinNumberLabel = (port: SourcePort) =>
  port.pin_number !== undefined ? `pin${port.pin_number}` : undefined

const isGenericPinLabel = (label: string, port: SourcePort): boolean => {
  if (port.pin_number === undefined) return false
  const normalizedLabel = label.trim().toLowerCase()
  return (
    normalizedLabel === String(port.pin_number) ||
    normalizedLabel === getPinNumberLabel(port)?.toLowerCase()
  )
}

const shouldUseAsPrimaryLabel = (label: string, port: SourcePort): boolean => {
  if (isGenericPinLabel(label, port)) return false
  if (nonPrimaryPinLabels.has(label.trim().toLowerCase())) return false
  return scorePhrase(label) > 0.5
}

const uniqueLabels = (labels: string[]) => Array.from(new Set(labels))

export const getReadableLabelsForPort = (port: SourcePort) => {
  const pinNumberLabel = getPinNumberLabel(port)
  const hasGenericPortName = !port.name || isGenericPinLabel(port.name, port)
  const allLabels = [
    ...(port.name ? [port.name] : []),
    ...(port.port_hints ?? []),
  ]
  const primaryLabel =
    allLabels.find((label) => shouldUseAsPrimaryLabel(label, port)) ??
    port.name ??
    pinNumberLabel ??
    port.source_port_id
  const aliases: string[] = []
  const displayAliases: string[] = []

  if (pinNumberLabel && pinNumberLabel !== primaryLabel) {
    aliases.push(pinNumberLabel)
    if (hasGenericPortName) {
      displayAliases.push(pinNumberLabel)
    }
  }

  for (const label of allLabels) {
    if (label === primaryLabel) continue
    if (label === pinNumberLabel) continue
    if (label === String(port.pin_number)) continue
    if (isGenericPinLabel(label, port)) continue
    aliases.push(label)
    if (nonPrimaryPinLabels.has(label.trim().toLowerCase())) continue
    displayAliases.push(label)
  }

  return {
    primaryLabel,
    aliases: uniqueLabels(aliases),
    displayAliases: uniqueLabels(displayAliases),
  }
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
  const { primaryLabel, displayAliases } = getReadableLabelsForPort(port)

  const additionalPinLabels: string[] = []

  if (isPositive && component.ftype !== "simple_resistor") {
    additionalPinLabels.push("+")
  } else if (isNegative && component.ftype !== "simple_resistor") {
    additionalPinLabels.push("-")
  }

  additionalPinLabels.push(...displayAliases)

  const displayValue = component.display_value
    ? ` (${component.display_value})`
    : ""
  return `${component.name} ${primaryLabel}${additionalPinLabels.length > 0 ? ` (${additionalPinLabels.join(", ")})` : ""}${displayValue}`
}
