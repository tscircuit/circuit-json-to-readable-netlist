import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { scorePhrase } from "lib/scorePhrase"
import { renderCircuit } from "tests/fixtures/render-circuit"

it("preserves time-to-digital converter pin labels in readable net names", () => {
  expect(scorePhrase("TDC_START1")).toBeGreaterThan(scorePhrase("pos"))
  expect(scorePhrase("TDC_STOP1")).toBeGreaterThan(scorePhrase("pin14"))
  expect(scorePhrase("TIME_TO_DIGITAL1")).toBeGreaterThan(scorePhrase("pos"))

  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="soic8"
        manufacturerPartNumber="TDC7200"
        pinLabels={{
          pin1: ["TDC_START1", "TDC_STOP1"],
          pin2: ["TIME_TO_DIGITAL1"],
        }}
      />
      <resistor resistance="1k" footprint="0402" name="R1" />

      <trace from=".U1 .TDC_START1" to=".R1 > .pin1" />
    </board>,
  )

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_TDC_START1")
  expect(netlist).toContain("  - U1 TDC_START1 (TDC_STOP1)")
  expect(netlist).not.toContain("NET: R1_pos")
})
