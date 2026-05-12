import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

it("preserves barometric sensor aliases in net entries", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="qfn24"
        manufacturerPartNumber="BMP388"
        pinLabels={{
          pin14: ["pin14", "BARO_INT1"],
          pin15: ["pin15", "BMP_SDO1"],
          pin16: ["pin16", "LPS_DRDY1"],
        }}
      />
      <chip
        name="J1"
        footprint="pinrow3"
        manufacturerPartNumber="CONN"
        pinLabels={{
          pin1: ["IRQ"],
          pin2: ["SDO"],
          pin3: ["DRDY"],
        }}
      />

      <trace from=".U1 .pin14" to=".J1 .pin1" />
      <trace from=".U1 .pin15" to=".J1 .pin2" />
      <trace from=".U1 .pin16" to=".J1 .pin3" />
    </board>,
  )

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_BARO_INT1")
  expect(netlist).toContain("  - U1 pin14 (BARO_INT1)")
  expect(netlist).toContain("NET: U1_BMP_SDO1")
  expect(netlist).toContain("  - U1 pin15 (BMP_SDO1)")
  expect(netlist).toContain("NET: U1_LPS_DRDY1")
  expect(netlist).toContain("  - U1 pin16 (LPS_DRDY1)")
})
