import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { scorePhrase } from "lib/scorePhrase"
import { renderCircuit } from "tests/fixtures/render-circuit"

it("preserves rangefinder aliases on generic chip pins", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="soic16"
        manufacturerPartNumber="RangeSensorHub"
        pinLabels={{
          pin14: ["pin14", "ULTRASONIC_TRIG"],
          pin15: ["pin15", "TOF_READY"],
        }}
      />
      <resistor resistance="1k" footprint="0402" name="R1" />
      <resistor resistance="2k" footprint="0402" name="R2" />

      <trace from=".U1 .ULTRASONIC_TRIG" to=".R1 .pin1" />
      <trace from=".U1 .TOF_READY" to=".R2 .pin1" />
    </board>,
  )

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_ULTRASONIC_TRIG")
  expect(netlist).toContain("  - U1 pin14 (ULTRASONIC_TRIG)")
  expect(netlist).toContain("NET: U1_TOF_READY")
  expect(netlist).toContain("  - U1 pin15 (TOF_READY)")
  expect(scorePhrase("SONAR_ECHO")).toBeGreaterThan(1)
  expect(scorePhrase("LIDAR_INT")).toBeGreaterThan(1)
})
