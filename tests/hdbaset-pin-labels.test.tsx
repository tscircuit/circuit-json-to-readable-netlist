import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { scorePhrase } from "lib/scorePhrase"
import { renderCircuit } from "tests/fixtures/render-circuit"

it("scores HDBaseT transport aliases above passive labels", () => {
  expect(scorePhrase("HDBT_TXP0")).toBeGreaterThan(scorePhrase("pos"))
  expect(scorePhrase("HDBT_RXN0")).toBeGreaterThan(scorePhrase("pos"))
  expect(scorePhrase("VALENS_LINK1")).toBeGreaterThan(scorePhrase("pos"))
})

it("preserves HDBaseT and Valens labels in readable netlists", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="qfn64"
        manufacturerPartNumber="HDBT-TX"
        pinLabels={{
          pin1: ["HDBT_TXP0"],
          pin2: ["VALENS_LINK1"],
        }}
      />
      <resistor resistance="10k" footprint="0402" name="R1" />
      <resistor resistance="10k" footprint="0402" name="R2" />

      <trace from=".U1 .HDBT_TXP0" to=".R1 > .pin1" />
      <trace from=".U1 .VALENS_LINK1" to=".R2 > .pin1" />
    </board>,
  )

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_HDBT_TXP0")
  expect(netlist).toContain("  - U1 HDBT_TXP0")
  expect(netlist).toContain("- pin1(HDBT_TXP0): NETS(U1_HDBT_TXP0)")
  expect(netlist).toContain("NET: U1_VALENS_LINK1")
  expect(netlist).toContain("  - U1 VALENS_LINK1")
  expect(netlist).toContain("- pin2(VALENS_LINK1): NETS(U1_VALENS_LINK1)")
})
