import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

it("test4 should preserve automotive audio bus labels", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="qfn48"
        manufacturerPartNumber="AD2428W"
        pinLabels={{
          pin1: ["A2B_AP1"],
          pin2: ["A2B_AN1"],
          pin3: ["AD2428_A2B_BP1"],
          pin4: ["AD2429_A2B_BN1"],
          pin5: ["MOST150_TX1"],
          pin6: ["MOST_BUS_RX1"],
        }}
      />
      <resistor resistance="1k" footprint="0402" name="R1" />
      <resistor resistance="1k" footprint="0402" name="R2" />
      <resistor resistance="1k" footprint="0402" name="R3" />
      <resistor resistance="1k" footprint="0402" name="R4" />
      <resistor resistance="1k" footprint="0402" name="R5" />
      <resistor resistance="1k" footprint="0402" name="R6" />

      <trace from=".U1 .A2B_AP1" to=".R1 > .pin1" />
      <trace from=".U1 .A2B_AN1" to=".R2 > .pin1" />
      <trace from=".U1 .AD2428_A2B_BP1" to=".R3 > .pin1" />
      <trace from=".U1 .AD2429_A2B_BN1" to=".R4 > .pin1" />
      <trace from=".U1 .MOST150_TX1" to=".R5 > .pin1" />
      <trace from=".U1 .MOST_BUS_RX1" to=".R6 > .pin1" />
    </board>,
  )

  const readableNetlist = convertCircuitJsonToReadableNetlist(circuitJson)

  for (const label of [
    "A2B_AP1",
    "A2B_AN1",
    "AD2428_A2B_BP1",
    "AD2429_A2B_BN1",
    "MOST150_TX1",
    "MOST_BUS_RX1",
  ]) {
    expect(readableNetlist).toContain(`NET: U1_${label}`)
    expect(readableNetlist).toContain(`NETS(U1_${label})`)
  }

  expect(readableNetlist).not.toContain("NET: U1_pin")
})
