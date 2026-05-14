import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { scorePhrase } from "lib/scorePhrase"
import { renderCircuit } from "tests/fixtures/render-circuit"

it("scores isolated gate-driver aliases above generic numbered pins", () => {
  expect(scorePhrase("DESAT1")).toBeGreaterThan(scorePhrase("pin14"))
  expect(scorePhrase("MILLER_CLAMP1")).toBeGreaterThan(scorePhrase("pos"))
  expect(scorePhrase("GATE_HS1")).toBeGreaterThan(1)
})

it("preserves isolated gate-driver aliases in readable netlists", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="soic16"
        manufacturerPartNumber="UCC21750"
        pinLabels={{
          pin1: ["pin14", "DESAT1"],
          pin2: ["pin15", "MILLER_CLAMP1"],
          pin3: ["pin16", "GATE_HS1"],
        }}
      />
      <resistor resistance="1k" footprint="0402" name="R1" />
      <resistor resistance="2k" footprint="0402" name="R2" />
      <resistor resistance="3k" footprint="0402" name="R3" />

      <trace from=".U1 .pin14" to=".R1 > .pin1" />
      <trace from=".U1 .pin15" to=".R2 > .pin1" />
      <trace from=".U1 .pin16" to=".R3 > .pin1" />
    </board>,
  )

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_DESAT1")
  expect(netlist).toContain("  - U1 pin14 (DESAT1)")
  expect(netlist).toContain("NET: U1_MILLER_CLAMP1")
  expect(netlist).toContain("  - U1 pin15 (MILLER_CLAMP1)")
  expect(netlist).toContain("NET: U1_GATE_HS1")
  expect(netlist).toContain("  - U1 pin16 (GATE_HS1)")
})
