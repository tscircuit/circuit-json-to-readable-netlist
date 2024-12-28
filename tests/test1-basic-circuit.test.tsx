import { renderCircuit } from "tests/fixtures/render-circuit"
import { it, expect } from "bun:test"

it("should render a basic circuit", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm">
      <resistor resistance="1k" footprint="0402" name="R1" schX={3} pcbX={3} />
      <capacitor
        capacitance="1nF"
        footprint="0402"
        name="C1"
        schX={-3}
        pcbX={-3}
      />
      <trace from=".R1 > .pin1" to=".C1 > .pin1" />
    </board>,
  )

  // expect
})
