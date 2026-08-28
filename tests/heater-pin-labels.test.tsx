import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { scorePhrase } from "lib/scorePhrase"
import { renderCircuit } from "tests/fixtures/render-circuit"

it("preserves heater control aliases in readable labels", () => {
  expect(scorePhrase("HEATER_EN1")).toBeGreaterThan(1)
  expect(scorePhrase("HEAT_PWM1")).toBeGreaterThan(1)

  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="soic8"
        manufacturerPartNumber="HEATER_CTRL"
        pinLabels={{
          pin1: ["pin1", "HEATER_EN1"],
          pin2: ["pin2", "HEAT_PWM1"],
          pin3: ["GND"],
          pin4: ["VDD"],
        }}
      />
      <resistor resistance="10k" footprint="0402" name="R1" />
      <trace from=".U1 .HEATER_EN1" to=".R1 .pin1" />
      <trace from=".U1 .HEAT_PWM1" to=".R1 .pin2" />
    </board>,
  )

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_HEATER_EN1")
  expect(netlist).toContain("  - U1 pin1 (HEATER_EN1)")
  expect(netlist).toContain("NET: U1_HEAT_PWM1")
  expect(netlist).toContain("  - U1 pin2 (HEAT_PWM1)")
  expect(netlist).toContain("- pin1(HEATER_EN1): NETS(U1_HEATER_EN1)")
  expect(netlist).toContain("- pin2(HEAT_PWM1): NETS(U1_HEAT_PWM1)")
})
