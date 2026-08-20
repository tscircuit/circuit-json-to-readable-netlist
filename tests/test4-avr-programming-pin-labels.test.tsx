import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

it("scores AVR programming aliases before generic digit fallback", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="soic8"
        manufacturerPartNumber="ATtiny1616"
        pinLabels={{
          pin1: ["UPDI_DATA1"],
          pin2: ["DEBUGWIRE1"],
          pin3: ["PDI_CLK1"],
        }}
      />
      <resistor resistance="1k" footprint="0402" name="R1" />
      <resistor resistance="1k" footprint="0402" name="R2" />
      <resistor resistance="1k" footprint="0402" name="R3" />

      <trace from=".U1 .UPDI_DATA1" to=".R1 > .pin1" />
      <trace from=".U1 .DEBUGWIRE1" to=".R2 > .pin1" />
      <trace from=".U1 .PDI_CLK1" to=".R3 > .pin1" />
    </board>,
  )

  const readableNetlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(readableNetlist).toContain("NET: U1_UPDI_DATA1")
  expect(readableNetlist).toContain("NET: U1_DEBUGWIRE1")
  expect(readableNetlist).toContain("NET: U1_PDI_CLK1")
  expect(readableNetlist).toContain("  - U1 UPDI_DATA1")
  expect(readableNetlist).toContain("  - U1 DEBUGWIRE1")
  expect(readableNetlist).toContain("  - U1 PDI_CLK1")
  expect(readableNetlist).toContain("- pin1(UPDI_DATA1): NETS(U1_UPDI_DATA1)")
  expect(readableNetlist).toContain("- pin2(DEBUGWIRE1): NETS(U1_DEBUGWIRE1)")
  expect(readableNetlist).toContain("- pin3(PDI_CLK1): NETS(U1_PDI_CLK1)")
})
