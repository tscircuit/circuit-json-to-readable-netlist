import { su } from "@tscircuit/circuit-json-util"
import type {
  AnyCircuitElement,
  CircuitJson,
  SourceNet,
  SourcePort,
} from "circuit-json"
import { scorePhrase } from "./scorePhrase"

const isGenericPinLabel = (label: string) => /^pin\d+$/i.test(label)

const isNumericPinHint = (hint: string, pinNumber: number | undefined) =>
  pinNumber !== undefined && hint === String(pinNumber)

const shouldIncludeAdditionalPinLabel = ({
  hint,
  mainPinName,
  componentType,
  pinNumber,
}: {
  hint: string
  mainPinName: string
  componentType: string | undefined
  pinNumber: number | undefined
}) => {
  if (hint === mainPinName) return false
  if (isGenericPinLabel(hint)) return false
  if (isNumericPinHint(hint, pinNumber)) return false

  const score = scorePhrase(hint)
  if (score > 1) return true

  return componentType === "simple_chip" && score >= 0.5
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
  const mainPinName =
    port.name ?? port.port_hints?.[0] ?? `Pin${port.pin_number ?? ""}`

  const additionalPinLabels: string[] = []

  if (isPositive && component.ftype !== "simple_resistor") {
    additionalPinLabels.push("+")
  } else if (isNegative && component.ftype !== "simple_resistor") {
    additionalPinLabels.push("-")
  }

  for (const port_hint of port.port_hints ?? []) {
    if (
      shouldIncludeAdditionalPinLabel({
        hint: port_hint,
        mainPinName,
        componentType: component.ftype,
        pinNumber: port.pin_number,
      })
    ) {
      additionalPinLabels.push(port_hint)
    }
  }

  const componentName = component.name ?? component.source_component_id
  const displayValue = component.display_value
    ? ` (${component.display_value})`
    : ""
  const uniqueAdditionalPinLabels = Array.from(new Set(additionalPinLabels))
  return `${componentName} ${mainPinName}${uniqueAdditionalPinLabels.length > 0 ? ` (${uniqueAdditionalPinLabels.join(",")})` : ""}${displayValue}`
}
