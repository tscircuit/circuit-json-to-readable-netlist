import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

it("test4 should preserve ARINC and MIL-STD-1553 aerospace bus labels", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="qfn32"
        manufacturerPartNumber="HI-3593"
        pinLabels={{
          pin1: ["ARINC429_TX1"],
          pin2: ["ARINC_RX1"],
          pin3: ["A429_LABEL1"],
          pin4: ["MIL1553_TXP1"],
          pin5: ["M1553_RXN1"],
          pin6: ["1553B_STUB1"],
        }}
      />
      <resistor resistance="1k" footprint="0402" name="R1" />
      <resistor resistance="1k" footprint="0402" name="R2" />
      <resistor resistance="1k" footprint="0402" name="R3" />
      <resistor resistance="1k" footprint="0402" name="R4" />
      <resistor resistance="1k" footprint="0402" name="R5" />
      <resistor resistance="1k" footprint="0402" name="R6" />

      <trace from=".U1 .ARINC429_TX1" to=".R1 > .pin1" />
      <trace from=".U1 .ARINC_RX1" to=".R2 > .pin1" />
      <trace from=".U1 .A429_LABEL1" to=".R3 > .pin1" />
      <trace from=".U1 .MIL1553_TXP1" to=".R4 > .pin1" />
      <trace from=".U1 .M1553_RXN1" to=".R5 > .pin1" />
      <trace from=".U1 .1553B_STUB1" to=".R6 > .pin1" />
    </board>,
  )

  const readableNetlist = convertCircuitJsonToReadableNetlist(circuitJson)

  for (const label of [
    "ARINC429_TX1",
    "ARINC_RX1",
    "A429_LABEL1",
    "MIL1553_TXP1",
    "M1553_RXN1",
    "1553B_STUB1",
  ]) {
    expect(readableNetlist).toContain(`NET: U1_${label}`)
    expect(readableNetlist).toContain(`NETS(U1_${label})`)
  }

  expect(readableNetlist).not.toContain("NET: U1_pin")
})
