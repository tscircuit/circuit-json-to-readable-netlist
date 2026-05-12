import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

it("keeps wireless coexistence and short-range radio pin aliases readable", () => {
  const circuitJson = renderCircuit(
    <board width="20mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="qfn32"
        manufacturerPartNumber="WIRELESS-MODULE"
        pinLabels={{
          pin1: ["pin1", "WLAN_ACTIVE1"],
          pin2: ["pin2", "BT_PRIORITY1"],
          pin3: ["pin3", "PTA_GRANT"],
          pin4: ["pin4", "ZB_CCA1"],
          pin5: ["pin5", "UWB_IRQ1"],
          pin6: ["pin6", "COEX_REQ"],
        }}
      />
      <resistor resistance="10k" footprint="0402" name="R1" />
      <resistor resistance="10k" footprint="0402" name="R2" />
      <capacitor capacitance="100nF" footprint="0402" name="C1" />
      <capacitor capacitance="100nF" footprint="0402" name="C2" />
      <resistor resistance="0" footprint="0402" name="R3" />
      <capacitor capacitance="1nF" footprint="0402" name="C3" />

      <trace from=".U1 .WLAN_ACTIVE1" to=".R1 .pin1" />
      <trace from=".U1 .BT_PRIORITY1" to=".R2 .pin1" />
      <trace from=".U1 .PTA_GRANT" to=".C1 .pin1" />
      <trace from=".U1 .ZB_CCA1" to=".C2 .pin1" />
      <trace from=".U1 .UWB_IRQ1" to=".R3 .pin1" />
      <trace from=".U1 .COEX_REQ" to=".C3 .pin1" />
    </board>,
  )

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_WLAN_ACTIVE1")
  expect(netlist).toContain("  - U1 pin1 (WLAN_ACTIVE1)")
  expect(netlist).toContain("NET: U1_BT_PRIORITY1")
  expect(netlist).toContain("  - U1 pin2 (BT_PRIORITY1)")
  expect(netlist).toContain("NET: U1_PTA_GRANT")
  expect(netlist).toContain("  - U1 pin3 (PTA_GRANT)")
  expect(netlist).toContain("NET: U1_ZB_CCA1")
  expect(netlist).toContain("  - U1 pin4 (ZB_CCA1)")
  expect(netlist).toContain("NET: U1_UWB_IRQ1")
  expect(netlist).toContain("  - U1 pin5 (UWB_IRQ1)")
  expect(netlist).toContain("NET: U1_COEX_REQ")
  expect(netlist).toContain("  - U1 pin6 (COEX_REQ)")
})
