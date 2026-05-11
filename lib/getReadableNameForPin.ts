import { su } from "@tscircuit/circuit-json-util"
import type { AnyCircuitElement } from "circuit-json"
import { scorePhrase } from "./scorePhrase"

const weakPinHints = new Set([
  "anode",
  "cathode",
  "left",
  "neg",
  "negative",
  "pos",
  "positive",
  "right",
])

const isGenericPinName = (name: string) => /^pin\d+$/i.test(name)

const normalizeLabel = (label: unknown) =>
  typeof label === "string" ? label.trim() : ""

const addUniqueLabel = (labels: string[], label: string) => {
  if (!label) return
  const lowerLabel = label.toLowerCase()
  if (labels.some((existing) => existing.toLowerCase() === lowerLabel)) return
  labels.push(label)
}

const isDescriptivePinHint = (hint: string) => {
  const normalizedHint = hint.trim()
  if (!normalizedHint) return false
  if (/^\d+$/.test(normalizedHint)) return false
  if (isGenericPinName(normalizedHint)) return false
  if (weakPinHints.has(normalizedHint.toLowerCase())) return false
  return /[a-z]/i.test(normalizedHint)
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

  const rawPortName = normalizeLabel(port.name)
  const fallbackPinName =
    port.pin_number !== undefined ? `Pin${port.pin_number}` : ""
  const descriptivePinHint = (port.port_hints ?? [])
    .map(normalizeLabel)
    .find(isDescriptivePinHint)

  let mainPinName = rawPortName || fallbackPinName
  if (
    descriptivePinHint &&
    (!mainPinName ||
      (component.ftype === "simple_chip" && isGenericPinName(mainPinName)))
  ) {
    mainPinName = descriptivePinHint
  }
  if (!mainPinName) mainPinName = port.source_port_id

  const additionalPinLabels: string[] = []
  if (rawPortName && rawPortName !== mainPinName) {
    addUniqueLabel(additionalPinLabels, rawPortName)
  }

  if (isPositive && component.ftype !== "simple_resistor") {
    addUniqueLabel(additionalPinLabels, "+")
  } else if (isNegative && component.ftype !== "simple_resistor") {
    addUniqueLabel(additionalPinLabels, "-")
  }

  for (const port_hint of port.port_hints ?? []) {
    const normalizedHint = normalizeLabel(port_hint)
    if (!normalizedHint) continue
    if (normalizedHint === String(port.pin_number)) continue
    if (normalizedHint.toLowerCase() === mainPinName.toLowerCase()) continue
    const score = scorePhrase(port_hint)
    if (
      (component.ftype === "simple_chip" && isDescriptivePinHint(port_hint)) ||
      score > 1
    ) {
      addUniqueLabel(additionalPinLabels, normalizedHint)
    }
  }

  const displayValue = component.display_value
    ? ` (${component.display_value})`
    : ""
  return `${component.name} ${mainPinName}${additionalPinLabels.length > 0 ? ` (${additionalPinLabels.join(",")})` : ""}${displayValue}`
}
