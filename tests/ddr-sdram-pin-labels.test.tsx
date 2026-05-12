import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

it("preserves DDR SDRAM and SRAM aliases in readable netlists", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="tqfp48"
        manufacturerPartNumber="MEM-CTRL"
        pinLabels={{
          pin14: ["pin14", "DDR_DQ0"],
          pin15: ["pin15", "SDRAM_A1"],
          pin16: ["pin16", "SRAM_DQ1"],
        }}
      />
      <resistor name="R1" resistance="33" footprint="0402" />
      <capacitor name="C1" capacitance="100nF" footprint="0402" />
      <trace from=".U1 .DDR_DQ0" to=".R1 .pin1" />
      <trace from=".U1 .SDRAM_A1" to=".C1 .pin1" />
    </board>,
  )

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_DDR_DQ0")
  expect(netlist).toContain("  - U1 pin14 (DDR_DQ0)")
  expect(netlist).toContain("NET: U1_SDRAM_A1")
  expect(netlist).toContain("  - U1 pin15 (SDRAM_A1)")
  expect(netlist).toContain("- pin16(SRAM_DQ1): NOT_CONNECTED")
})
