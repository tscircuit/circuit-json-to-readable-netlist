import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

it("preserves IMU motion sensor aliases on generic pins", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="qfn24"
        manufacturerPartNumber="ICM-42688-P"
        pinLabels={{
          pin14: ["ACCEL_X"],
          pin15: ["GYRO_Z"],
        }}
      />
      <resistor resistance="10k" footprint="0402" name="R1" />
      <resistor resistance="10k" footprint="0402" name="R2" />

      <trace from=".U1 .ACCEL_X" to=".R1 > .pin1" />
      <trace from=".U1 .GYRO_Z" to=".R2 > .pin1" />
    </board>,
  )
  for (const element of circuitJson) {
    if (element.type !== "source_port") continue
    if (element.name === "ACCEL_X") element.name = "pin14"
    if (element.name === "GYRO_Z") element.name = "pin15"
  }

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_ACCEL_X")
  expect(netlist).toContain("  - U1 pin14 (ACCEL_X)")
  expect(netlist).toContain("NET: U1_GYRO_Z")
  expect(netlist).toContain("  - U1 pin15 (GYRO_Z)")
})
