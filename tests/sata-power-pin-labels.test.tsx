import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

it("scores SATA data and power pin aliases", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="J1"
        footprint="qfn16"
        manufacturerPartNumber="SATA-22"
        pinLabels={{
          pin1: ["SATA_TXP1"],
          pin2: ["SATA_RXN1"],
          pin3: ["P3V3_1"],
          pin4: ["P12V_1"],
          pin5: ["DEVSLP"],
        }}
      />
      <capacitor capacitance="1nF" footprint="0402" name="C1" />
      <capacitor capacitance="1nF" footprint="0402" name="C2" />
      <capacitor capacitance="1nF" footprint="0402" name="C3" />
      <capacitor capacitance="1nF" footprint="0402" name="C4" />
      <capacitor capacitance="1nF" footprint="0402" name="C5" />

      <trace from=".J1 .SATA_TXP1" to=".C1 .pin1" />
      <trace from=".J1 .SATA_RXN1" to=".C2 .pin1" />
      <trace from=".J1 .P3V3_1" to=".C3 .pin1" />
      <trace from=".J1 .P12V_1" to=".C4 .pin1" />
      <trace from=".J1 .DEVSLP" to=".C5 .pin1" />
    </board>,
  )

  const readableNetlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(readableNetlist).toContain("NET: J1_SATA_TXP1")
  expect(readableNetlist).toContain("NET: J1_SATA_RXN1")
  expect(readableNetlist).toContain("NET: J1_P3V3_1")
  expect(readableNetlist).toContain("NET: J1_P12V_1")
  expect(readableNetlist).toContain("NET: J1_DEVSLP")
})
