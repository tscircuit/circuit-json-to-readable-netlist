import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

it("test4 should preserve HDQ and SDQ battery fuel-gauge labels", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="qfn24"
        manufacturerPartNumber="BQ27542"
        pinLabels={{
          pin1: ["HDQ_DATA1"],
          pin2: ["SDQ_DATA1"],
          pin3: ["BQ274_INT1"],
          pin4: ["BQ275_BAT_LOW1"],
          pin5: ["FUEL_GAUGE_ALERT1"],
          pin6: ["GAUGE_WAKE1"],
        }}
      />
      <resistor resistance="1k" footprint="0402" name="R1" />
      <resistor resistance="1k" footprint="0402" name="R2" />
      <resistor resistance="1k" footprint="0402" name="R3" />
      <resistor resistance="1k" footprint="0402" name="R4" />
      <resistor resistance="1k" footprint="0402" name="R5" />
      <resistor resistance="1k" footprint="0402" name="R6" />

      <trace from=".U1 .HDQ_DATA1" to=".R1 > .pin1" />
      <trace from=".U1 .SDQ_DATA1" to=".R2 > .pin1" />
      <trace from=".U1 .BQ274_INT1" to=".R3 > .pin1" />
      <trace from=".U1 .BQ275_BAT_LOW1" to=".R4 > .pin1" />
      <trace from=".U1 .FUEL_GAUGE_ALERT1" to=".R5 > .pin1" />
      <trace from=".U1 .GAUGE_WAKE1" to=".R6 > .pin1" />
    </board>,
  )

  const readableNetlist = convertCircuitJsonToReadableNetlist(circuitJson)

  for (const label of [
    "HDQ_DATA1",
    "SDQ_DATA1",
    "BQ274_INT1",
    "BQ275_BAT_LOW1",
    "FUEL_GAUGE_ALERT1",
    "GAUGE_WAKE1",
  ]) {
    expect(readableNetlist).toContain(`NET: U1_${label}`)
    expect(readableNetlist).toContain(`NETS(U1_${label})`)
  }

  expect(readableNetlist).not.toContain("NET: U1_pin")
})
