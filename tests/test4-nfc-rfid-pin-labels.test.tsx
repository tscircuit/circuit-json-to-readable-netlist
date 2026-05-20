import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { scorePhrase } from "lib/scorePhrase"
import { renderCircuit } from "tests/fixtures/render-circuit"

it("preserves NFC and RFID reader pin labels in readable net names", () => {
  expect(scorePhrase("NFC_IRQ1")).toBeGreaterThan(scorePhrase("pin14"))
  expect(scorePhrase("FIELD_DET1")).toBeGreaterThan(scorePhrase("pos"))
  expect(scorePhrase("ANT1")).toBeGreaterThan(scorePhrase("pin8"))

  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="qfn32"
        manufacturerPartNumber="PN532"
        pinLabels={{
          pin1: ["NFC_IRQ1"],
          pin2: ["FIELD_DET1"],
          pin3: ["ANT1"],
          pin4: ["ANT2"],
        }}
      />
      <resistor resistance="1k" footprint="0402" name="R1" />
      <capacitor capacitance="10pF" footprint="0402" name="C1" />

      <trace from=".U1 .NFC_IRQ1" to=".R1 > .pin1" />
      <trace from=".U1 .FIELD_DET1" to=".C1 > .pin1" />
    </board>,
  )

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_NFC_IRQ1")
  expect(netlist).toContain("  - U1 NFC_IRQ1")
  expect(netlist).toContain("NET: U1_FIELD_DET1")
  expect(netlist).toContain("  - U1 FIELD_DET1")
})
