import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { scorePhrase } from "lib/scorePhrase"
import { renderCircuit } from "tests/fixtures/render-circuit"

it("preserves industrial sensor-link aliases on generic chip pins", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="soic16"
        manufacturerPartNumber="IndustrialAfe"
        pinLabels={{
          pin14: ["pin14", "IOLINK_CQ"],
          pin15: ["pin15", "LOOP_4_20MA"],
        }}
      />
      <resistor resistance="1k" footprint="0402" name="R1" />
      <resistor resistance="2k" footprint="0402" name="R2" />

      <trace from=".U1 .IOLINK_CQ" to=".R1 .pin1" />
      <trace from=".U1 .LOOP_4_20MA" to=".R2 .pin1" />
    </board>,
  )

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_IOLINK_CQ")
  expect(netlist).toContain("  - U1 pin14 (IOLINK_CQ)")
  expect(netlist).toContain("NET: U1_LOOP_4_20MA")
  expect(netlist).toContain("  - U1 pin15 (LOOP_4_20MA)")
  expect(scorePhrase("IO_LINK_WAKE")).toBeGreaterThan(1)
  expect(scorePhrase("HART_TX")).toBeGreaterThan(1)
})
