import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

it("preserves HDMI TMDS and sideband aliases in generated net names", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="qfn16"
        manufacturerPartNumber="HDMI_TX"
        pinLabels={{
          pin14: ["TMDS_CLK_P1"],
          pin15: ["HDMI_HPD1"],
          pin16: ["CEC1"],
        }}
      />
      <capacitor capacitance="1nF" footprint="0402" name="C1" />
      <resistor resistance="1k" footprint="0402" name="R1" />
      <capacitor capacitance="10nF" footprint="0402" name="C2" />

      <trace from=".U1 .TMDS_CLK_P1" to=".C1 .pin1" />
      <trace from=".U1 .HDMI_HPD1" to=".R1 .pin1" />
      <trace from=".U1 .CEC1" to=".C2 .pin1" />
    </board>,
  )

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_TMDS_CLK_P1")
  expect(netlist).toContain("NET: U1_HDMI_HPD1")
  expect(netlist).toContain("NET: U1_CEC1")
  expect(netlist).toContain("  - U1 TMDS_CLK_P1")
  expect(netlist).toContain("  - U1 HDMI_HPD1")
  expect(netlist).toContain("  - U1 CEC1")
})
