import type { AnyCircuitElement, SourcePort } from "circuit-json"
import { scorePhrase } from "./scorePhrase"

export const getUsefulSchematicLabelsForPort = ({
  circuitJson,
  port,
}: {
  circuitJson: AnyCircuitElement[]
  port: SourcePort
}): string[] => {
  return circuitJson
    .filter(
      (element) =>
        element.type === "schematic_port" &&
        "source_port_id" in element &&
        element.source_port_id === port.source_port_id &&
        "display_pin_label" in element &&
        typeof element.display_pin_label === "string",
    )
    .map((element) => element.display_pin_label)
    .filter((label) => {
      if (!label) return false
      if (label === port.name) return false
      if (label === String(port.pin_number)) return false
      return scorePhrase(label) >= 1
    })
}
