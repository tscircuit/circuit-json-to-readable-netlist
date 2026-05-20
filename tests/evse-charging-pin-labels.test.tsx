import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

it("preserves EV charging control aliases in readable net names and pin labels", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="soic16"
        manufacturerPartNumber="EVSECTRL"
        pinLabels={{
          pin14: ["GPIO14", "EVSE_CP1"],
          pin15: ["GPIO15", "J1772_PP1"],
          pin16: ["GPIO16", "CCS_PROX1"],
        }}
      />
      <resistor resistance="1k" footprint="0402" name="R1" />
      <resistor resistance="2k" footprint="0402" name="R2" />
      <resistor resistance="3k" footprint="0402" name="R3" />

      <trace from=".U1 .EVSE_CP1" to=".R1 > .pin1" />
      <trace from=".U1 .J1772_PP1" to=".R2 > .pin1" />
      <trace from=".U1 .CCS_PROX1" to=".R3 > .pin1" />
    </board>,
  )

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_EVSE_CP1")
  expect(netlist).toContain("NET: U1_J1772_PP1")
  expect(netlist).toContain("NET: U1_CCS_PROX1")
  expect(netlist).toContain("  - U1 GPIO14 (EVSE_CP1)")
  expect(netlist).toContain("  - U1 GPIO15 (J1772_PP1)")
  expect(netlist).toContain("  - U1 GPIO16 (CCS_PROX1)")
  expect(netlist).toContain("- pin14(GPIO14, EVSE_CP1): NETS(U1_EVSE_CP1)")
  expect(netlist).toContain("- pin15(GPIO15, J1772_PP1): NETS(U1_J1772_PP1)")
  expect(netlist).toContain("- pin16(GPIO16, CCS_PROX1): NETS(U1_CCS_PROX1)")
})
