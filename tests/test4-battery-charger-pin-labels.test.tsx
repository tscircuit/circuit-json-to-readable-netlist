import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

it("preserves battery charger pin aliases on generic chip pins", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="qfn16"
        manufacturerPartNumber="BQ24075"
        pinLabels={{
          pin14: ["pin14", "CHG"],
          pin15: ["pin15", "ACOK"],
          pin16: ["pin16", "ILIM"],
        }}
      />
      <resistor resistance="10k" footprint="0402" name="RCHG" />
      <resistor resistance="10k" footprint="0402" name="RACOK" />
      <resistor resistance="1k" footprint="0402" name="RILIM" />

      <trace from=".U1 .CHG" to=".RCHG .pin1" />
      <trace from=".U1 .ACOK" to=".RACOK .pin1" />
      <trace from=".U1 .ILIM" to=".RILIM .pin1" />
    </board>,
  )

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_CHG")
  expect(netlist).toContain("  - U1 pin14 (CHG)")
  expect(netlist).toContain("NET: U1_ACOK")
  expect(netlist).toContain("  - U1 pin15 (ACOK)")
  expect(netlist).toContain("NET: U1_ILIM")
  expect(netlist).toContain("  - U1 pin16 (ILIM)")
  expect(netlist).toContain("- pin14(CHG): NETS(U1_CHG)")
  expect(netlist).toContain("- pin15(ACOK): NETS(U1_ACOK)")
  expect(netlist).toContain("- pin16(ILIM): NETS(U1_ILIM)")
})
