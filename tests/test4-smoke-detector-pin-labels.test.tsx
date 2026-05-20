import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { scorePhrase } from "lib/scorePhrase"
import { renderCircuit } from "tests/fixtures/render-circuit"

it("preserves smoke detector pin labels in readable net names", () => {
  expect(scorePhrase("SMOKE_DET1")).toBeGreaterThan(scorePhrase("pos"))
  expect(scorePhrase("ION_CHAMBER1")).toBeGreaterThan(scorePhrase("pin14"))
  expect(scorePhrase("PHOTO_SMOKE1")).toBeGreaterThan(scorePhrase("pos"))

  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="soic8"
        manufacturerPartNumber="SMOKE_AFE"
        pinLabels={{
          pin1: ["SMOKE_DET1", "ION_CHAMBER1"],
          pin2: ["PHOTO_SMOKE1"],
        }}
      />
      <resistor resistance="1k" footprint="0402" name="R1" />

      <trace from=".U1 .SMOKE_DET1" to=".R1 > .pin1" />
    </board>,
  )

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_SMOKE_DET1")
  expect(netlist).toContain("  - U1 SMOKE_DET1 (ION_CHAMBER1)")
  expect(netlist).not.toContain("NET: R1_pos")
})
