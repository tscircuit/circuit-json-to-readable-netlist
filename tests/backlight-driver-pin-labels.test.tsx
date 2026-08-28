import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

it("scores display backlight and WLED driver pin labels", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="qfn24"
        manufacturerPartNumber="WLED-BACKLIGHT"
        pinLabels={{
          pin1: ["pin14", "BL_PWM1"],
          pin2: ["pin15", "BACKLIGHT_EN1"],
          pin3: ["pin16", "LEDK1"],
          pin4: ["pin17", "WLED_FB1"],
        }}
      />
      <resistor resistance="10k" footprint="0402" name="R1" />
      <capacitor capacitance="100nF" footprint="0402" name="C1" />

      <trace from=".U1 .BL_PWM1" to=".R1 > .pin1" />
      <trace from=".U1 .BACKLIGHT_EN1" to=".R1 > .pin2" />
      <trace from=".U1 .LEDK1" to=".C1 > .pin1" />
      <trace from=".U1 .WLED_FB1" to=".C1 > .pin2" />
    </board>,
  )

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_BL_PWM1")
  expect(netlist).toContain("  - U1 pin14 (BL_PWM1)")
  expect(netlist).toContain("- pin1(pin14, BL_PWM1): NETS(U1_BL_PWM1)")

  expect(netlist).toContain("NET: U1_BACKLIGHT_EN1")
  expect(netlist).toContain("  - U1 pin15 (BACKLIGHT_EN1)")

  expect(netlist).toContain("NET: U1_LEDK1")
  expect(netlist).toContain("  - U1 pin16 (LEDK1)")

  expect(netlist).toContain("NET: U1_WLED_FB1")
  expect(netlist).toContain("  - U1 pin17 (WLED_FB1)")
  expect(netlist).toContain("- pin4(pin17, WLED_FB1): NETS(U1_WLED_FB1)")
})
