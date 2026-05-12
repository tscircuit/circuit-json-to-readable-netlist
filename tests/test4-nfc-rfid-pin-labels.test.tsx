import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

it("preserves NFC and RFID pin aliases with digits", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="soic16"
        manufacturerPartNumber="PN532"
        pinLabels={{
          pin14: ["NFC_IRQ1"],
          pin15: ["RFID_FIELD1"],
        }}
      />
      <resistor resistance="1k" footprint="0402" name="R1" />

      <trace from=".U1 .pin14" to=".R1 .pin1" />
      <trace from=".U1 .pin15" to=".R1 .pin2" />
    </board>,
  )

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_NFC_IRQ1")
  expect(netlist).toContain("NET: U1_RFID_FIELD1")
  expect(netlist).toContain("- U1 NFC_IRQ1")
  expect(netlist).toContain("- U1 RFID_FIELD1")
  expect(netlist).toContain("- pin14(NFC_IRQ1): NETS(U1_NFC_IRQ1)")
  expect(netlist).toContain("- pin15(RFID_FIELD1): NETS(U1_RFID_FIELD1)")
})
