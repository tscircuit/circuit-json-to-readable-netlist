import { su } from "@tscircuit/circuit-json-util"
import type { AnyCircuitElement } from "circuit-json"
import {
  getReadablePinAliases,
  getReadablePinLabel,
  isLowInformationPinLabel,
} from "./pin-labels"

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

  const isPositive = port.port_hints?.some((hint) =>
    ["anode", "pos", "positive"].includes(hint.toLowerCase()),
  )
  const isNegative = port.port_hints?.some((hint) =>
    ["cathode", "neg", "negative"].includes(hint.toLowerCase()),
  )

  const preferDescriptiveHints =
    component.ftype !== "simple_resistor" &&
    component.ftype !== "simple_capacitor"
  const mainPinName = getReadablePinLabel(port, { preferDescriptiveHints })

  const additionalPinLabels: string[] = []
  if (isPositive && component.ftype !== "simple_resistor") {
    additionalPinLabels.push("+")
  } else if (isNegative && component.ftype !== "simple_resistor") {
    additionalPinLabels.push("-")
  }

  additionalPinLabels.push(
    ...getReadablePinAliases(port, mainPinName, {
      includeAllDescriptiveHints:
        preferDescriptiveHints &&
        Boolean(port.name && isLowInformationPinLabel(port.name, port)),
    }),
  )

  const displayValue = component.display_value
    ? ` (${component.display_value})`
    : ""
  const pinLabels = Array.from(new Set(additionalPinLabels))
  return `${component.name} ${mainPinName}${pinLabels.length > 0 ? ` (${pinLabels.join(",")})` : ""}${displayValue}`
}
