import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

it("test4 should preserve SDI-12 sensor bus labels", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="qfn16"
        manufacturerPartNumber="SDI12_SENSOR_IF"
        pinLabels={{
          pin1: ["SDI12_DATA1"],
          pin2: ["SDI12_WAKE1"],
          pin3: ["SDI_12_DIR1"],
          pin4: ["SDI12_PWR_EN1"],
          pin5: ["SDI12_BREAK1"],
          pin6: ["SDI12_SENSOR1"],
        }}
      />
      <resistor resistance="1k" footprint="0402" name="R1" />
      <resistor resistance="1k" footprint="0402" name="R2" />
      <resistor resistance="1k" footprint="0402" name="R3" />
      <resistor resistance="1k" footprint="0402" name="R4" />
      <resistor resistance="1k" footprint="0402" name="R5" />
      <resistor resistance="1k" footprint="0402" name="R6" />

      <trace from=".U1 .SDI12_DATA1" to=".R1 > .pin1" />
      <trace from=".U1 .SDI12_WAKE1" to=".R2 > .pin1" />
      <trace from=".U1 .SDI_12_DIR1" to=".R3 > .pin1" />
      <trace from=".U1 .SDI12_PWR_EN1" to=".R4 > .pin1" />
      <trace from=".U1 .SDI12_BREAK1" to=".R5 > .pin1" />
      <trace from=".U1 .SDI12_SENSOR1" to=".R6 > .pin1" />
    </board>,
  )

  const readableNetlist = convertCircuitJsonToReadableNetlist(circuitJson)

  for (const label of [
    "SDI12_DATA1",
    "SDI12_WAKE1",
    "SDI_12_DIR1",
    "SDI12_PWR_EN1",
    "SDI12_BREAK1",
    "SDI12_SENSOR1",
  ]) {
    expect(readableNetlist).toContain(`NET: U1_${label}`)
    expect(readableNetlist).toContain(`NETS(U1_${label})`)
  }

  expect(readableNetlist).not.toContain("NET: U1_pin")
})
