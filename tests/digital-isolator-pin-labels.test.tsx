import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { scorePhrase } from "lib/scorePhrase"
import { renderCircuit } from "tests/fixtures/render-circuit"

it("scores digital-isolator aliases above passive labels", () => {
  expect(scorePhrase("ADUM_IN1")).toBeGreaterThan(scorePhrase("pos"))
  expect(scorePhrase("ADUM_OUT1")).toBeGreaterThan(scorePhrase("pos"))
  expect(scorePhrase("SI86_CH1")).toBeGreaterThan(scorePhrase("pos"))
})

it("preserves digital-isolator labels in readable netlists", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="soic16"
        manufacturerPartNumber="ADUM1401"
        pinLabels={{
          pin1: ["ADUM_IN1"],
          pin2: ["SI86_CH1"],
        }}
      />
      <resistor resistance="10k" footprint="0402" name="R1" />
      <resistor resistance="10k" footprint="0402" name="R2" />

      <trace from=".U1 .ADUM_IN1" to=".R1 > .pin1" />
      <trace from=".U1 .SI86_CH1" to=".R2 > .pin1" />
    </board>,
  )

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_ADUM_IN1")
  expect(netlist).toContain("  - U1 ADUM_IN1")
  expect(netlist).toContain("- pin1(ADUM_IN1): NETS(U1_ADUM_IN1)")
  expect(netlist).toContain("NET: U1_SI86_CH1")
  expect(netlist).toContain("  - U1 SI86_CH1")
  expect(netlist).toContain("- pin2(SI86_CH1): NETS(U1_SI86_CH1)")
})
