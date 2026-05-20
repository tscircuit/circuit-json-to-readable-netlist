import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

it("prefers high-speed ethernet pin labels over generic passive pin names", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="soic8"
        manufacturerPartNumber="ETHERNET_PHY"
        pinLabels={{
          pin1: ["XGMII_TXD0"],
          pin2: ["XGMII_RXC1"],
          pin3: ["XAUI_TXP0"],
          pin4: ["USXGMII_RXN1"],
          pin5: ["QSGMII_REFCLK1"],
        }}
      />
      <resistor resistance="49.9" footprint="0402" name="R1" />
      <resistor resistance="49.9" footprint="0402" name="R2" />
      <capacitor capacitance="100nF" footprint="0402" name="C1" />
      <capacitor capacitance="100nF" footprint="0402" name="C2" />
      <capacitor capacitance="100nF" footprint="0402" name="C3" />

      <trace from=".U1 .XGMII_TXD0" to=".R1 .pin1" />
      <trace from=".U1 .XGMII_RXC1" to=".R2 .pin1" />
      <trace from=".U1 .XAUI_TXP0" to=".C1 .pin1" />
      <trace from=".U1 .USXGMII_RXN1" to=".C2 .pin1" />
      <trace from=".U1 .QSGMII_REFCLK1" to=".C3 .pin1" />
    </board>,
  )

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_XGMII_TXD0")
  expect(netlist).toContain("NET: U1_XGMII_RXC1")
  expect(netlist).toContain("NET: U1_XAUI_TXP0")
  expect(netlist).toContain("NET: U1_USXGMII_RXN1")
  expect(netlist).toContain("NET: U1_QSGMII_REFCLK1")
})
