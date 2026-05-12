import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { scorePhrase } from "lib/scorePhrase"
import { renderCircuit } from "tests/fixtures/render-circuit"

declare module "bun:test" {
  interface Matchers<T = unknown> {
    toMatchInlineSnapshot(snapshot?: string | null): Promise<MatcherResult>
  }
}

it("scores SENT and PSI5 automotive sensor aliases above passive labels", () => {
  expect(scorePhrase("SENT_OUT1")).toBeGreaterThan(scorePhrase("pos"))
  expect(scorePhrase("PSI5_DATA1")).toBeGreaterThan(scorePhrase("pos"))
})

it("preserves SENT and PSI5 pin labels in readable netlists", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="soic8"
        manufacturerPartNumber="SENSOR-HUB"
        pinLabels={{
          pin1: ["SENT_OUT1"],
          pin2: ["PSI5_DATA1"],
        }}
      />
      <resistor resistance="10k" footprint="0402" name="R1" />
      <resistor resistance="10k" footprint="0402" name="R2" />

      <trace from=".U1 .SENT_OUT1" to=".R1 > .pin1" />
      <trace from=".U1 .PSI5_DATA1" to=".R2 > .pin1" />
    </board>,
  )

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_SENT_OUT1")
  expect(netlist).toContain("  - U1 SENT_OUT1")
  expect(netlist).toContain("- pin1(SENT_OUT1): NETS(U1_SENT_OUT1)")
  expect(netlist).toContain("NET: U1_PSI5_DATA1")
  expect(netlist).toContain("  - U1 PSI5_DATA1")
  expect(netlist).toContain("- pin2(PSI5_DATA1): NETS(U1_PSI5_DATA1)")
})
