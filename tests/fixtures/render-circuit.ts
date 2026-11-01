import { Circuit } from "@tscircuit/core"
import type { CircuitJson } from "circuit-json"

export const renderCircuit = (
  reactNode: React.ReactElement,
  { pcbDisabled = false }: { pcbDisabled?: boolean } = {},
): CircuitJson => {
  const circuit = new Circuit()
  circuit.pcbDisabled = pcbDisabled
  circuit.add(reactNode)
  circuit.render()
  return circuit.getCircuitJson() as CircuitJson
}
