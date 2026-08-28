import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

it("preserves quadrature encoder pin aliases in readable netlists", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="soic8"
        manufacturerPartNumber="STM32G0"
        pinLabels={{
          pin1: ["pin14", "QEA0"],
          pin2: ["pin15", "QEB0"],
        }}
      />
      <resistor resistance="10k" footprint="0402" name="R1" />

      <trace from=".U1 .QEA0" to=".R1 > .pin1" />
      <trace from=".U1 .QEB0" to=".R1 > .pin2" />
    </board>,
  )

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_QEA0")
  expect(netlist).toContain("  - U1 pin14 (QEA0)")
  expect(netlist).toContain("NET: U1_QEB0")
  expect(netlist).toContain("  - U1 pin15 (QEB0)")
  expect(netlist).toContain("- pin1(pin14, QEA0): NETS(U1_QEA0)")
  expect(netlist).toContain("- pin2(pin15, QEB0): NETS(U1_QEB0)")
})
