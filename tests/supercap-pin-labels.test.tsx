import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { scorePhrase } from "lib/scorePhrase"
import { renderCircuit } from "tests/fixtures/render-circuit"

it("scores supercapacitor backup aliases above passive labels", () => {
  expect(scorePhrase("SUPERCAP_P1")).toBeGreaterThan(scorePhrase("pos"))
  expect(scorePhrase("ULTRACAP_N1")).toBeGreaterThan(scorePhrase("pos"))
  expect(scorePhrase("BACKUP_CAP1")).toBeGreaterThan(scorePhrase("pos"))
})

it("preserves supercapacitor backup labels in readable netlists", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="qfn24"
        manufacturerPartNumber="BACKUP-PMU"
        pinLabels={{
          pin1: ["SUPERCAP_P1"],
          pin2: ["ULTRACAP_N1"],
        }}
      />
      <resistor resistance="10k" footprint="0402" name="R1" />
      <resistor resistance="10k" footprint="0402" name="R2" />

      <trace from=".U1 .SUPERCAP_P1" to=".R1 > .pin1" />
      <trace from=".U1 .ULTRACAP_N1" to=".R2 > .pin1" />
    </board>,
  )

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_SUPERCAP_P1")
  expect(netlist).toContain("  - U1 SUPERCAP_P1")
  expect(netlist).toContain("- pin1(SUPERCAP_P1): NETS(U1_SUPERCAP_P1)")
  expect(netlist).toContain("NET: U1_ULTRACAP_N1")
  expect(netlist).toContain("  - U1 ULTRACAP_N1")
  expect(netlist).toContain("- pin2(ULTRACAP_N1): NETS(U1_ULTRACAP_N1)")
})
