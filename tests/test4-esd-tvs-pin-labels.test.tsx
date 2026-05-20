import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { scorePhrase } from "lib/scorePhrase"
import { renderCircuit } from "tests/fixtures/render-circuit"

it("scores ESD and TVS protection aliases before generic digit labels", () => {
  expect(scorePhrase("ESD_PROTECT1")).toBeGreaterThan(scorePhrase("pos"))
  expect(scorePhrase("TVS_IO1")).toBeGreaterThan(scorePhrase("pin14"))
  expect(scorePhrase("SURGE_CLAMP1")).toBeGreaterThan(scorePhrase("left"))
})

it("preserves ESD and surge protection labels in readable netlists", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="soic8"
        manufacturerPartNumber="TPD4E05U06"
        pinLabels={{
          pin1: ["ESD_PROTECT1", "TVS_IO1"],
          pin2: ["SURGE_CLAMP1"],
        }}
      />
      <resistor resistance="1k" footprint="0402" name="R1" />
      <capacitor capacitance="1nF" footprint="0402" name="C1" />

      <trace from=".U1 .ESD_PROTECT1" to=".R1 > .pin1" />
      <trace from=".U1 .SURGE_CLAMP1" to=".C1 > .pin1" />
    </board>,
  )

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_ESD_PROTECT1")
  expect(netlist).toContain("  - U1 ESD_PROTECT1 (TVS_IO1)")
  expect(netlist).toContain("NET: U1_SURGE_CLAMP1")
  expect(netlist).toContain("  - U1 SURGE_CLAMP1")
  expect(netlist).not.toContain("NET: R1_pos")
  expect(netlist).not.toContain("NET: C1_pos")
})
