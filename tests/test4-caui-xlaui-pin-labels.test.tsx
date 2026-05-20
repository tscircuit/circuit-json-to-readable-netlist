import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

it("prefers CAUI XLAUI and high-lane Ethernet labels over passive pin names", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="bga196"
        manufacturerPartNumber="HUNDRED_G_PHY"
        pinLabels={{
          pin1: ["CAUI_TXP0"],
          pin2: ["XLAUI_RXN1"],
          pin3: ["100GBASE_LR4_TX2"],
        }}
      />
      <resistor resistance="49.9" footprint="0402" name="R1" />
      <resistor resistance="49.9" footprint="0402" name="R2" />
      <capacitor capacitance="100nF" footprint="0402" name="C1" />

      <trace from=".U1 .CAUI_TXP0" to=".R1 .pin1" />
      <trace from=".U1 .XLAUI_RXN1" to=".R2 .pin1" />
      <trace from=".U1 .100GBASE_LR4_TX2" to=".C1 .pin1" />
    </board>,
  )

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_CAUI_TXP0")
  expect(netlist).toContain("NET: U1_XLAUI_RXN1")
  expect(netlist).toContain("NET: U1_100GBASE_LR4_TX2")
  expect(netlist).toContain("- pin1(CAUI_TXP0): NETS(U1_CAUI_TXP0)")
  expect(netlist).toContain("- pin2(XLAUI_RXN1): NETS(U1_XLAUI_RXN1)")
  expect(netlist).toContain(
    "- pin3(100GBASE_LR4_TX2): NETS(U1_100GBASE_LR4_TX2)",
  )
})
