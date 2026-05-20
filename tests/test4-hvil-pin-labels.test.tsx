import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { scorePhrase } from "lib/scorePhrase"
import { renderCircuit } from "tests/fixtures/render-circuit"

it("preserves HVIL interlock pin labels in readable net names", () => {
  expect(scorePhrase("HVIL_LOOP1")).toBeGreaterThan(scorePhrase("pos"))
  expect(scorePhrase("HV_INTERLOCK1")).toBeGreaterThan(scorePhrase("pin14"))
  expect(scorePhrase("HV_CONNECTOR_DET1")).toBeGreaterThan(scorePhrase("pos"))

  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="soic8"
        manufacturerPartNumber="HV_MONITOR"
        pinLabels={{
          pin1: ["HVIL_LOOP1", "HV_INTERLOCK1"],
          pin2: ["HV_CONNECTOR_DET1"],
        }}
      />
      <resistor resistance="1k" footprint="0402" name="R1" />

      <trace from=".U1 .HVIL_LOOP1" to=".R1 > .pin1" />
    </board>,
  )

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_HVIL_LOOP1")
  expect(netlist).toContain("  - U1 HVIL_LOOP1 (HV_INTERLOCK1)")
  expect(netlist).not.toContain("NET: R1_pos")
})
