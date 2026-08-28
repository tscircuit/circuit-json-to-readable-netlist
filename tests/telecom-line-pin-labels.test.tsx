import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { scorePhrase } from "lib/scorePhrase"
import { renderCircuit } from "tests/fixtures/render-circuit"

it("scores telecom line-interface aliases above generic numbered pins", () => {
  expect(scorePhrase("RING_DET1")).toBeGreaterThan(scorePhrase("pin14"))
  expect(scorePhrase("FXS_TIP")).toBeGreaterThan(scorePhrase("pos"))
  expect(scorePhrase("OFFHOOK")).toBeGreaterThan(1)
})

it("preserves telecom line-interface aliases in readable netlists", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="soic8"
        manufacturerPartNumber="SI3210"
        pinLabels={{
          pin1: ["pin14", "RING_DET1"],
          pin2: ["pin15", "FXS_TIP"],
        }}
      />
      <resistor resistance="1k" footprint="0402" name="R1" />
      <resistor resistance="2k" footprint="0402" name="R2" />

      <trace from=".U1 .pin14" to=".R1 > .pin1" />
      <trace from=".U1 .pin15" to=".R2 > .pin1" />
    </board>,
  )

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_RING_DET1")
  expect(netlist).toContain("  - U1 pin14 (RING_DET1)")
  expect(netlist).toContain("NET: U1_FXS_TIP")
  expect(netlist).toContain("  - U1 pin15 (FXS_TIP)")
})
