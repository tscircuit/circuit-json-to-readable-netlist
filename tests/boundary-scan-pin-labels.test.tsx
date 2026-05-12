import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { scorePhrase } from "lib/scorePhrase"
import { renderCircuit } from "tests/fixtures/render-circuit"

it("scores boundary-scan aliases above passive labels", () => {
  expect(scorePhrase("BSCAN_TDI1")).toBeGreaterThan(scorePhrase("pos"))
  expect(scorePhrase("SCAN_CHAIN1")).toBeGreaterThan(scorePhrase("pos"))
  expect(scorePhrase("BIST_DONE1")).toBeGreaterThan(scorePhrase("pos"))
})

it("preserves boundary-scan and BIST labels in readable netlists", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="bga100"
        manufacturerPartNumber="TEST-ASIC"
        pinLabels={{
          pin1: ["BSCAN_TDI1"],
          pin2: ["BIST_DONE1"],
        }}
      />
      <resistor resistance="10k" footprint="0402" name="R1" />
      <resistor resistance="10k" footprint="0402" name="R2" />

      <trace from=".U1 .BSCAN_TDI1" to=".R1 > .pin1" />
      <trace from=".U1 .BIST_DONE1" to=".R2 > .pin1" />
    </board>,
  )

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_BSCAN_TDI1")
  expect(netlist).toContain("  - U1 BSCAN_TDI1")
  expect(netlist).toContain("- pin1(BSCAN_TDI1): NETS(U1_BSCAN_TDI1)")
  expect(netlist).toContain("NET: U1_BIST_DONE1")
  expect(netlist).toContain("  - U1 BIST_DONE1")
  expect(netlist).toContain("- pin2(BIST_DONE1): NETS(U1_BIST_DONE1)")
})
