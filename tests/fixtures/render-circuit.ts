import { Circuit } from "@tscircuit/core"
import type { CircuitJson } from "circuit-json"

export const renderCircuit = (reactNode: React.ReactElement): CircuitJson => {
  const circuit = new Circuit()
  circuit.add(reactNode)
  circuit.render()
  return circuit.getCircuitJson()
}
