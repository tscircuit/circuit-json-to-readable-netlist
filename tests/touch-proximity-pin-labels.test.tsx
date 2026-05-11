import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

it("preserves capacitive touch pin aliases in readable netlists", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="soic8"
        manufacturerPartNumber="AT42QT2120"
        pinLabels={{
          pin1: ["pin14", "TOUCH0"],
          pin2: ["pin15", "CAPSENSE0"],
        }}
      />
      <resistor resistance="10k" footprint="0402" name="R1" />

      <trace from=".U1 .TOUCH0" to=".R1 > .pin1" />
      <trace from=".U1 .CAPSENSE0" to=".R1 > .pin2" />
    </board>,
  )

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_TOUCH0")
  expect(netlist).toContain("  - U1 pin14 (TOUCH0)")
  expect(netlist).toContain("NET: U1_CAPSENSE0")
  expect(netlist).toContain("  - U1 pin15 (CAPSENSE0)")
  expect(netlist).toContain("- pin1(pin14, TOUCH0): NETS(U1_TOUCH0)")
  expect(netlist).toContain("- pin2(pin15, CAPSENSE0): NETS(U1_CAPSENSE0)")
})
