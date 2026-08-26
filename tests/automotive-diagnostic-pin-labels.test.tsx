import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { scorePhrase } from "lib/scorePhrase"
import { renderCircuit } from "tests/fixtures/render-circuit"

it("preserves automotive diagnostic aliases on generic chip pins", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="soic16"
        manufacturerPartNumber="VehicleGateway"
        pinLabels={{
          pin14: ["pin14", "KLINE1"],
          pin15: ["pin15", "FLEXRAY_BP"],
        }}
      />
      <resistor resistance="1k" footprint="0402" name="R1" />
      <resistor resistance="2k" footprint="0402" name="R2" />

      <trace from=".U1 .KLINE1" to=".R1 .pin1" />
      <trace from=".U1 .FLEXRAY_BP" to=".R2 .pin1" />
    </board>,
  )

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_KLINE1")
  expect(netlist).toContain("  - U1 pin14 (KLINE1)")
  expect(netlist).toContain("NET: U1_FLEXRAY_BP")
  expect(netlist).toContain("  - U1 pin15 (FLEXRAY_BP)")
  expect(scorePhrase("J1850_PWM")).toBeGreaterThan(1)
  expect(scorePhrase("OBD_WAKE")).toBeGreaterThan(1)
})
