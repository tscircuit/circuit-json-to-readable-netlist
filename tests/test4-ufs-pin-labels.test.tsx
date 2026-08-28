import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

it("preserves UFS storage aliases on generic chip pins", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="qfn20"
        manufacturerPartNumber="UFSCTRL"
        pinLabels={{
          pin14: ["pin14", "UFS_TXP0"],
          pin15: ["pin15", "UFS_RXN0"],
          pin16: ["pin16", "UFS_REFCLK"],
          pin17: ["pin17", "UFS_RESET_N"],
        }}
      />
      <resistor resistance="10k" footprint="0402" name="R1" />
      <capacitor capacitance="1nF" footprint="0402" name="C1" />

      <trace from=".U1 .UFS_TXP0" to=".R1 .pin1" />
      <trace from=".U1 .UFS_RXN0" to=".R1 .pin2" />
      <trace from=".U1 .UFS_REFCLK" to=".C1 .pin1" />
      <trace from=".U1 .UFS_RESET_N" to=".C1 .pin2" />
    </board>,
  )

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_UFS_TXP0")
  expect(netlist).toContain("  - U1 pin14 (UFS_TXP0)")
  expect(netlist).toContain("NET: U1_UFS_RXN0")
  expect(netlist).toContain("  - U1 pin15 (UFS_RXN0)")
  expect(netlist).toContain("NET: U1_UFS_REFCLK")
  expect(netlist).toContain("  - U1 pin16 (UFS_REFCLK)")
  expect(netlist).toContain("NET: U1_UFS_RESET_N")
  expect(netlist).toContain("  - U1 pin17 (UFS_RESET_N)")
})
