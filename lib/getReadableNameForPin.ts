import { su } from "@tscircuit/circuit-json-util"
import type {
  AnyCircuitElement,
  CircuitJson,
  SourceNet,
  SourcePort,
} from "circuit-json"
import { scorePhrase } from "./scorePhrase"

const lowSignalPinHints = new Set([
  "anode",
  "cathode",
  "left",
  "right",
  "neg",
  "negative",
  "pos",
  "positive",
])

type PinLabelsByName = Record<string, string | string[] | undefined>

const normalizePinLabel = (label: string) => label.trim()

const isPinNumberOnlyLabel = (label: string, pinNumber?: number) => {
  if (label.match(/^\d+$/)) return true
  if (pinNumber === undefined) return false
  return label.toLowerCase() === `pin${pinNumber}`.toLowerCase()
}

const getComponentPinLabels = ({
  component,
  port,
}: {
  component: AnyCircuitElement | undefined
  port: SourcePort
}) => {
  const pinLabels =
    (component as { pin_labels?: PinLabelsByName; pinLabels?: PinLabelsByName })
      ?.pin_labels ??
    (component as { pin_labels?: PinLabelsByName; pinLabels?: PinLabelsByName })
      ?.pinLabels
  if (!pinLabels) return []

  const labelKeys = [
    port.pin_number !== undefined ? `pin${port.pin_number}` : undefined,
    port.pin_number !== undefined ? String(port.pin_number) : undefined,
    port.name,
  ].filter(Boolean) as string[]

  return labelKeys.flatMap((key) => {
    const labels = pinLabels[key]
    if (!labels) return []
    return Array.isArray(labels) ? labels : [labels]
  })
}

export const getReadableLabelsForPin = ({
  component,
  includeLowSignalHints = false,
  port,
}: {
  component: AnyCircuitElement | undefined
  includeLowSignalHints?: boolean
  port: SourcePort
}): {
  primaryLabel: string
  aliases: string[]
  pinNumberLabel: string | undefined
} => {
  const pinNumberLabel =
    port.pin_number !== undefined ? `pin${port.pin_number}` : undefined
  const rawLabels = [
    port.name,
    ...(port.port_hints ?? []),
    ...getComponentPinLabels({ component, port }),
  ]
    .filter(Boolean)
    .map((label) => normalizePinLabel(label as string))
    .filter(Boolean)

  const uniqueLabels = Array.from(new Set(rawLabels))
  const semanticLabels = uniqueLabels.filter((label) => {
    if (isPinNumberOnlyLabel(label, port.pin_number)) return false
    if (
      !includeLowSignalHints &&
      lowSignalPinHints.has(label.toLowerCase()) &&
      scorePhrase(label) <= 1
    ) {
      return false
    }
    return true
  })

  const primaryLabel = semanticLabels[0] ?? port.name ?? pinNumberLabel ?? ""
  const aliases = semanticLabels.filter((label) => label !== primaryLabel)

  return {
    primaryLabel,
    aliases,
    pinNumberLabel,
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
  const { primaryLabel: mainPinName, aliases } = getReadableLabelsForPin({
    component,
    port,
  })

  const additionalPinLabels: string[] = []

  if (isPositive && component.ftype !== "simple_resistor") {
    additionalPinLabels.push("+")
  } else if (isNegative && component.ftype !== "simple_resistor") {
    additionalPinLabels.push("-")
  }

  for (const alias of aliases) {
    if (alias === mainPinName) continue
    additionalPinLabels.push(alias)
  }

  const displayValue = component.display_value
    ? ` (${component.display_value})`
    : ""
  return `${component.name} ${mainPinName}${additionalPinLabels.length > 0 ? ` (${additionalPinLabels.join(",")})` : ""}${displayValue}`
}
