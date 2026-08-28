import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

it("scores industrial fieldbus pin labels", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="soic16"
        manufacturerPartNumber="FIELDBUS-CTRL"
        pinLabels={{
          pin1: ["pin14", "PROFIBUS_A1"],
          pin2: ["pin15", "CC_LINK_DATA1"],
          pin3: ["pin16", "MVB_A1"],
        }}
      />
      <resistor resistance="120" footprint="0402" name="R1" />
      <capacitor capacitance="100nF" footprint="0402" name="C1" />

      <trace from=".U1 .PROFIBUS_A1" to=".R1 > .pin1" />
      <trace from=".U1 .CC_LINK_DATA1" to=".R1 > .pin2" />
      <trace from=".U1 .MVB_A1" to=".C1 > .pin1" />
    </board>,
  )

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_PROFIBUS_A1")
  expect(netlist).toContain("  - U1 pin14 (PROFIBUS_A1)")
  expect(netlist).toContain("- pin1(pin14, PROFIBUS_A1): NETS(U1_PROFIBUS_A1)")

  expect(netlist).toContain("NET: U1_CC_LINK_DATA1")
  expect(netlist).toContain("  - U1 pin15 (CC_LINK_DATA1)")

  expect(netlist).toContain("NET: U1_MVB_A1")
  expect(netlist).toContain("  - U1 pin16 (MVB_A1)")
  expect(netlist).toContain("- pin3(pin16, MVB_A1): NETS(U1_MVB_A1)")
})
