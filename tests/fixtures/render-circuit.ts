import { Circuit } from "@tscircuit/core"

export const renderCircuit = (reactNode: React.ReactElement) => {
  const circuit = new Circuit()
  circuit.add(reactNode)
  return circuit.render()
}
