import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { scorePhrase } from "lib/scorePhrase"
import { renderCircuit } from "tests/fixtures/render-circuit"

it("scores analog dimming aliases before generic digit labels", () => {
  expect(scorePhrase("ANALOG_DIM1")).toBeGreaterThan(scorePhrase("pos"))
  expect(scorePhrase("DIM_0_10V1")).toBeGreaterThan(scorePhrase("pin14"))
  expect(scorePhrase("DIM_SINK1")).toBeGreaterThan(scorePhrase("left"))
})

it("preserves analog dimming labels in readable netlists", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="soic8"
        manufacturerPartNumber="LM3409"
        pinLabels={{
          pin1: ["ANALOG_DIM1", "DIM_0_10V1"],
          pin2: ["DIM_SINK1"],
        }}
      />
      <resistor resistance="10k" footprint="0402" name="R1" />
      <capacitor capacitance="100nF" footprint="0402" name="C1" />

      <trace from=".U1 .ANALOG_DIM1" to=".R1 > .pin1" />
      <trace from=".U1 .DIM_SINK1" to=".C1 > .pin1" />
    </board>,
  )

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_ANALOG_DIM1")
  expect(netlist).toContain("  - U1 ANALOG_DIM1 (DIM_0_10V1)")
  expect(netlist).toContain("NET: U1_DIM_SINK1")
  expect(netlist).toContain("  - U1 DIM_SINK1")
  expect(netlist).not.toContain("NET: R1_pos")
  expect(netlist).not.toContain("NET: C1_pos")
})
