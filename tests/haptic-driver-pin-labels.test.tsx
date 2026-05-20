import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

it("scores haptic vibrator and piezo driver pin labels", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="qfn20"
        manufacturerPartNumber="HAPTIC-DRV"
        pinLabels={{
          pin1: ["pin14", "HAPTIC_EN1"],
          pin2: ["pin15", "VIB_DRV1"],
          pin3: ["pin16", "LRA_OUT1"],
          pin4: ["pin17", "ERM_PWM1"],
        }}
      />
      <resistor resistance="10k" footprint="0402" name="R1" />
      <capacitor capacitance="100nF" footprint="0402" name="C1" />

      <trace from=".U1 .HAPTIC_EN1" to=".R1 > .pin1" />
      <trace from=".U1 .VIB_DRV1" to=".R1 > .pin2" />
      <trace from=".U1 .LRA_OUT1" to=".C1 > .pin1" />
      <trace from=".U1 .ERM_PWM1" to=".C1 > .pin2" />
    </board>,
  )

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_HAPTIC_EN1")
  expect(netlist).toContain("  - U1 pin14 (HAPTIC_EN1)")
  expect(netlist).toContain("- pin1(pin14, HAPTIC_EN1): NETS(U1_HAPTIC_EN1)")

  expect(netlist).toContain("NET: U1_VIB_DRV1")
  expect(netlist).toContain("  - U1 pin15 (VIB_DRV1)")

  expect(netlist).toContain("NET: U1_LRA_OUT1")
  expect(netlist).toContain("  - U1 pin16 (LRA_OUT1)")

  expect(netlist).toContain("NET: U1_ERM_PWM1")
  expect(netlist).toContain("  - U1 pin17 (ERM_PWM1)")
  expect(netlist).toContain("- pin4(pin17, ERM_PWM1): NETS(U1_ERM_PWM1)")
})
