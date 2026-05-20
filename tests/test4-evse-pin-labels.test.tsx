import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { scorePhrase } from "lib/scorePhrase"
import { renderCircuit } from "tests/fixtures/render-circuit"

it("preserves EVSE control pilot pin labels in readable net names", () => {
  expect(scorePhrase("EVSE_CP1")).toBeGreaterThan(scorePhrase("pos"))
  expect(scorePhrase("CONTROL_PILOT1")).toBeGreaterThan(scorePhrase("pin14"))
  expect(scorePhrase("J1772_CP1")).toBeGreaterThan(scorePhrase("pos"))

  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="soic8"
        manufacturerPartNumber="EVSE_CTRL"
        pinLabels={{
          pin1: ["EVSE_CP1", "CONTROL_PILOT1"],
          pin2: ["J1772_CP1"],
        }}
      />
      <resistor resistance="1k" footprint="0402" name="R1" />

      <trace from=".U1 .EVSE_CP1" to=".R1 > .pin1" />
    </board>,
  )

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_EVSE_CP1")
  expect(netlist).toContain("  - U1 EVSE_CP1 (CONTROL_PILOT1)")
  expect(netlist).not.toContain("NET: R1_pos")
})
