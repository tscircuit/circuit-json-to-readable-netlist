import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

it("uses optical sensor aliases in readable net names", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="qfn16"
        manufacturerPartNumber="OPTICAL_CTRL"
        pinLabels={{
          pin1: ["LASER_FIRE1"],
          pin2: ["LIDAR_RX1"],
        }}
      />
      <resistor resistance="1k" footprint="0402" name="R1" />
      <resistor resistance="1k" footprint="0402" name="R2" />

      <trace from=".U1 .LASER_FIRE1" to=".R1 .pin1" />
      <trace from=".U1 .LIDAR_RX1" to=".R2 .pin1" />
    </board>,
  )

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_LASER_FIRE1")
  expect(netlist).toContain("NET: U1_LIDAR_RX1")
  expect(netlist).toContain("- U1 LASER_FIRE1")
  expect(netlist).toContain("- U1 LIDAR_RX1")
})
