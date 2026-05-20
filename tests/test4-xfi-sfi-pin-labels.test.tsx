import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

it("prefers XFI SFI and Ethernet backplane labels over passive pin names", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="qfn32"
        manufacturerPartNumber="TEN_G_PHY"
        pinLabels={{
          pin1: ["XFI_TXP0"],
          pin2: ["SFI_RXN0"],
          pin3: ["KR_REFCLK1"],
        }}
      />
      <resistor resistance="49.9" footprint="0402" name="R1" />
      <resistor resistance="49.9" footprint="0402" name="R2" />
      <capacitor capacitance="100nF" footprint="0402" name="C1" />

      <trace from=".U1 .XFI_TXP0" to=".R1 .pin1" />
      <trace from=".U1 .SFI_RXN0" to=".R2 .pin1" />
      <trace from=".U1 .KR_REFCLK1" to=".C1 .pin1" />
    </board>,
  )

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_XFI_TXP0")
  expect(netlist).toContain("NET: U1_SFI_RXN0")
  expect(netlist).toContain("NET: U1_KR_REFCLK1")
  expect(netlist).toContain("- pin1(XFI_TXP0): NETS(U1_XFI_TXP0)")
  expect(netlist).toContain("- pin2(SFI_RXN0): NETS(U1_SFI_RXN0)")
  expect(netlist).toContain("- pin3(KR_REFCLK1): NETS(U1_KR_REFCLK1)")
})
