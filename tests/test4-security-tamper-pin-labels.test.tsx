import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

declare module "bun:test" {
  interface Matchers<T = unknown> {
    toMatchInlineSnapshot(snapshot?: string | null): Promise<MatcherResult>
  }
}

it("preserves security tamper pin labels", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="SEC1"
        footprint="soic16"
        manufacturerPartNumber="ATECC608B"
        pinLabels={{
          pin14: ["pin14", "TAMPER1"],
          pin15: ["pin15", "CASE_OPEN"],
        }}
      />
      <resistor resistance="10k" footprint="0402" name="R1" />
      <capacitor capacitance="100nF" footprint="0402" name="C1" />

      <trace from=".SEC1 .pin14" to=".R1 .pin1" />
      <trace from=".SEC1 .pin15" to=".C1 .pin1" />
    </board>,
  )

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: SEC1_TAMPER1")
  expect(netlist).toContain("NET: SEC1_CASE_OPEN")
  expect(netlist).toContain("SEC1 pin14 (TAMPER1)")
  expect(netlist).toContain("SEC1 pin15 (CASE_OPEN)")
})
