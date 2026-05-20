import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { scorePhrase } from "lib/scorePhrase"
import { renderCircuit } from "tests/fixtures/render-circuit"

it("preserves current transformer and Rogowski pin labels in readable net names", () => {
  expect(scorePhrase("ROGOWSKI_COIL1")).toBeGreaterThan(scorePhrase("pos"))
  expect(scorePhrase("CURRENT_CLAMP1")).toBeGreaterThan(scorePhrase("pin14"))
  expect(scorePhrase("CT_SECONDARY1")).toBeGreaterThan(scorePhrase("pos"))

  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="soic8"
        manufacturerPartNumber="CURRENT_MONITOR"
        pinLabels={{
          pin1: ["ROGOWSKI_COIL1", "CURRENT_CLAMP1"],
          pin2: ["CT_SECONDARY1"],
        }}
      />
      <resistor resistance="1k" footprint="0402" name="R1" />

      <trace from=".U1 .ROGOWSKI_COIL1" to=".R1 > .pin1" />
    </board>,
  )

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_ROGOWSKI_COIL1")
  expect(netlist).toContain("  - U1 ROGOWSKI_COIL1 (CURRENT_CLAMP1)")
  expect(netlist).not.toContain("NET: R1_pos")
})
