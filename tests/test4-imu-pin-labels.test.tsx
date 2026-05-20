import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { scorePhrase } from "lib/scorePhrase"
import { renderCircuit } from "tests/fixtures/render-circuit"

it("preserves IMU interrupt and sync pin labels in readable net names", () => {
  expect(scorePhrase("INT1")).toBeGreaterThan(scorePhrase("pin14"))
  expect(scorePhrase("FSYNC1")).toBeGreaterThan(scorePhrase("pos"))
  expect(scorePhrase("SDO_SA0")).toBeGreaterThan(scorePhrase("pin8"))

  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="qfn24"
        manufacturerPartNumber="ICM-42688-P"
        pinLabels={{
          pin1: ["INT1", "DRDY"],
          pin2: ["FSYNC1"],
          pin3: ["SDO_SA0"],
          pin4: ["VDDIO"],
        }}
      />
      <resistor resistance="10k" footprint="0402" name="R1" />
      <resistor resistance="10k" footprint="0402" name="R2" />

      <trace from=".U1 .INT1" to=".R1 > .pin1" />
      <trace from=".U1 .FSYNC1" to=".R2 > .pin1" />
    </board>,
  )

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_INT1")
  expect(netlist).toContain("  - U1 INT1 (DRDY)")
  expect(netlist).toContain("NET: U1_FSYNC1")
  expect(netlist).toContain("  - U1 FSYNC1")
})
