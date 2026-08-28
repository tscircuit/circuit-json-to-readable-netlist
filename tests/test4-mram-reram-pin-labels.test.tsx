import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

it("scores MRAM and ReRAM aliases before generic digit fallback", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="soic16"
        manufacturerPartNumber="MR25H40"
        pinLabels={{
          pin1: ["MRAM_HOLD1"],
          pin2: ["STTMRAM_BUSY1"],
          pin3: ["RRAM_READY1"],
          pin4: ["RE_RAM_INT1"],
        }}
      />
      <resistor resistance="1k" footprint="0402" name="R1" />
      <resistor resistance="1k" footprint="0402" name="R2" />
      <resistor resistance="1k" footprint="0402" name="R3" />
      <resistor resistance="1k" footprint="0402" name="R4" />

      <trace from=".U1 .MRAM_HOLD1" to=".R1 > .pin1" />
      <trace from=".U1 .STTMRAM_BUSY1" to=".R2 > .pin1" />
      <trace from=".U1 .RRAM_READY1" to=".R3 > .pin1" />
      <trace from=".U1 .RE_RAM_INT1" to=".R4 > .pin1" />
    </board>,
  )

  const readableNetlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(readableNetlist).toContain("NET: U1_MRAM_HOLD1")
  expect(readableNetlist).toContain("NET: U1_STTMRAM_BUSY1")
  expect(readableNetlist).toContain("NET: U1_RRAM_READY1")
  expect(readableNetlist).toContain("NET: U1_RE_RAM_INT1")
  expect(readableNetlist).toContain("  - U1 MRAM_HOLD1")
  expect(readableNetlist).toContain("  - U1 STTMRAM_BUSY1")
  expect(readableNetlist).toContain("  - U1 RRAM_READY1")
  expect(readableNetlist).toContain("  - U1 RE_RAM_INT1")
  expect(readableNetlist).toContain("- pin1(MRAM_HOLD1): NETS(U1_MRAM_HOLD1)")
  expect(readableNetlist).toContain(
    "- pin2(STTMRAM_BUSY1): NETS(U1_STTMRAM_BUSY1)",
  )
  expect(readableNetlist).toContain("- pin3(RRAM_READY1): NETS(U1_RRAM_READY1)")
  expect(readableNetlist).toContain("- pin4(RE_RAM_INT1): NETS(U1_RE_RAM_INT1)")
})
