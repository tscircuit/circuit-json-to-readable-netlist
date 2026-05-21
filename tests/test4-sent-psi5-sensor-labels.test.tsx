import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

it("test4 should preserve SENT and PSI5 automotive sensor labels", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="qfn24"
        manufacturerPartNumber="TLE4998"
        pinLabels={{
          pin1: ["SENT_OUT1"],
          pin2: ["SENT_RX1"],
          pin3: ["SENT_TX1"],
          pin4: ["SPC_TRIG1"],
          pin5: ["PSI5_BUS1"],
          pin6: ["PSI5_SYNC1"],
        }}
      />
      <resistor resistance="1k" footprint="0402" name="R1" />
      <resistor resistance="1k" footprint="0402" name="R2" />
      <resistor resistance="1k" footprint="0402" name="R3" />
      <resistor resistance="1k" footprint="0402" name="R4" />
      <resistor resistance="1k" footprint="0402" name="R5" />
      <resistor resistance="1k" footprint="0402" name="R6" />

      <trace from=".U1 .SENT_OUT1" to=".R1 > .pin1" />
      <trace from=".U1 .SENT_RX1" to=".R2 > .pin1" />
      <trace from=".U1 .SENT_TX1" to=".R3 > .pin1" />
      <trace from=".U1 .SPC_TRIG1" to=".R4 > .pin1" />
      <trace from=".U1 .PSI5_BUS1" to=".R5 > .pin1" />
      <trace from=".U1 .PSI5_SYNC1" to=".R6 > .pin1" />
    </board>,
  )

  const readableNetlist = convertCircuitJsonToReadableNetlist(circuitJson)

  for (const label of [
    "SENT_OUT1",
    "SENT_RX1",
    "SENT_TX1",
    "SPC_TRIG1",
    "PSI5_BUS1",
    "PSI5_SYNC1",
  ]) {
    expect(readableNetlist).toContain(`NET: U1_${label}`)
    expect(readableNetlist).toContain(`NETS(U1_${label})`)
  }

  expect(readableNetlist).not.toContain("NET: U1_pin")
})
