import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

it("preserves wireless charging receiver aliases in net entries", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="qfn24"
        manufacturerPartNumber="WLC1115"
        pinLabels={{
          pin14: ["pin14", "QI_AC1"],
          pin15: ["pin15", "WPC_INT1"],
          pin16: ["pin16", "RECT_OUT"],
        }}
      />
      <chip
        name="J1"
        footprint="pinrow3"
        manufacturerPartNumber="CONN"
        pinLabels={{
          pin1: ["COIL_A"],
          pin2: ["IRQ"],
          pin3: ["OUT"],
        }}
      />

      <trace from=".U1 .pin14" to=".J1 .pin1" />
      <trace from=".U1 .pin15" to=".J1 .pin2" />
      <trace from=".U1 .pin16" to=".J1 .pin3" />
    </board>,
  )

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_QI_AC1")
  expect(netlist).toContain("  - U1 pin14 (QI_AC1)")
  expect(netlist).toContain("NET: U1_WPC_INT1")
  expect(netlist).toContain("  - U1 pin15 (WPC_INT1)")
  expect(netlist).toContain("NET: U1_RECT_OUT")
  expect(netlist).toContain("  - U1 pin16 (RECT_OUT)")
})
