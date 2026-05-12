import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { scorePhrase } from "lib/scorePhrase"
import { renderCircuit } from "tests/fixtures/render-circuit"

it("scores solid-state magnetic sensor aliases above passive labels", () => {
  expect(scorePhrase("HALL_OUT1")).toBeGreaterThan(scorePhrase("pos"))
  expect(scorePhrase("TMR_SENSE1")).toBeGreaterThan(scorePhrase("pos"))
  expect(scorePhrase("AMR_BRIDGE1")).toBeGreaterThan(scorePhrase("pos"))
  expect(scorePhrase("MAGNETOMETER_DRDY1")).toBeGreaterThan(scorePhrase("pos"))
})

it("preserves solid-state magnetic sensor labels in readable netlists", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="soic8"
        manufacturerPartNumber="HALL-SENSOR"
        pinLabels={{
          pin1: ["HALL_OUT1"],
          pin2: ["TMR_SENSE1"],
        }}
      />
      <resistor resistance="10k" footprint="0402" name="R1" />
      <resistor resistance="10k" footprint="0402" name="R2" />

      <trace from=".U1 .HALL_OUT1" to=".R1 > .pin1" />
      <trace from=".U1 .TMR_SENSE1" to=".R2 > .pin1" />
    </board>,
  )

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_HALL_OUT1")
  expect(netlist).toContain("  - U1 HALL_OUT1")
  expect(netlist).toContain("- pin1(HALL_OUT1): NETS(U1_HALL_OUT1)")
  expect(netlist).toContain("NET: U1_TMR_SENSE1")
  expect(netlist).toContain("  - U1 TMR_SENSE1")
  expect(netlist).toContain("- pin2(TMR_SENSE1): NETS(U1_TMR_SENSE1)")
})
