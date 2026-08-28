import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

it("prefers SWD and JTAG debug aliases over generic numbered pins", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="qfn32"
        manufacturerPartNumber="DBG_MCU"
        pinLabels={{
          pin14: ["SWDIO1"],
          pin15: ["SWCLK1"],
          pin16: ["JTMS1"],
          pin17: ["JTCK1"],
        }}
      />
      <resistor resistance="10k" footprint="0402" name="R1" />
      <resistor resistance="10k" footprint="0402" name="R2" />
      <resistor resistance="10k" footprint="0402" name="R3" />
      <resistor resistance="10k" footprint="0402" name="R4" />

      <trace from=".U1 .SWDIO1" to=".R1 .pin1" />
      <trace from=".U1 .SWCLK1" to=".R2 .pin1" />
      <trace from=".U1 .JTMS1" to=".R3 .pin1" />
      <trace from=".U1 .JTCK1" to=".R4 .pin1" />
    </board>,
  )

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_SWDIO1")
  expect(netlist).toContain("NET: U1_SWCLK1")
  expect(netlist).toContain("NET: U1_JTMS1")
  expect(netlist).toContain("NET: U1_JTCK1")
  expect(netlist).toContain("- U1 SWDIO1")
  expect(netlist).toContain("- U1 SWCLK1")
  expect(netlist).toContain("- U1 JTMS1")
  expect(netlist).toContain("- U1 JTCK1")
  expect(netlist).toContain("- pin14(SWDIO1): NETS(U1_SWDIO1)")
  expect(netlist).toContain("- pin15(SWCLK1): NETS(U1_SWCLK1)")
  expect(netlist).toContain("- pin16(JTMS1): NETS(U1_JTMS1)")
  expect(netlist).toContain("- pin17(JTCK1): NETS(U1_JTCK1)")
})
