import type { AnyCircuitElement, SourcePort } from "circuit-json"
import { scorePhrase } from "./scorePhrase"

export const getSchematicDisplayPinLabel = ({
  circuitJson,
  source_port_id,
}: {
  circuitJson: AnyCircuitElement[]
  source_port_id: string
}): string | undefined => {
  const schematicPort = circuitJson.find(
    (element) =>
      element.type === "schematic_port" &&
      "source_port_id" in element &&
      element.source_port_id === source_port_id,
  )

  if (
    schematicPort &&
    "display_pin_label" in schematicPort &&
    typeof schematicPort.display_pin_label === "string"
  ) {
    const label = schematicPort.display_pin_label.trim()
    if (label && scorePhrase(label) >= 1) {
      return label
    }
  }
}

export const getSourcePortLabelCandidates = ({
  circuitJson,
  port,
}: {
  circuitJson: AnyCircuitElement[]
  port: SourcePort
}): string[] => {
  const labels: string[] = []

  const addLabel = (label: unknown) => {
    if (typeof label !== "string") return
    const trimmedLabel = label.trim()
    if (trimmedLabel && !labels.includes(trimmedLabel)) {
      labels.push(trimmedLabel)
    }
  }

  addLabel(port.name)
  addLabel(
    getSchematicDisplayPinLabel({
      circuitJson,
      source_port_id: port.source_port_id,
    }),
  )
  for (const hint of port.port_hints ?? []) {
    addLabel(hint)
  }

  return labels
}
