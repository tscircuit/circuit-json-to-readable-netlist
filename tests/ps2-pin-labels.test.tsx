import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

it("preserves PS/2 keyboard and mouse aliases in readable netlists", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="soic16"
        manufacturerPartNumber="PS2-CTRL"
        pinLabels={{
          pin14: ["pin14", "PS2_CLK"],
          pin15: ["pin15", "KBD_DATA1"],
          pin16: ["pin16", "MOUSE_CLK1"],
        }}
      />
      <resistor name="R1" resistance="10k" footprint="0402" />
      <capacitor name="C1" capacitance="100nF" footprint="0402" />
      <trace from=".U1 .PS2_CLK" to=".R1 .pin1" />
      <trace from=".U1 .KBD_DATA1" to=".C1 .pin1" />
    </board>,
  )

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_PS2_CLK")
  expect(netlist).toContain("  - U1 pin14 (PS2_CLK)")
  expect(netlist).toContain("NET: U1_KBD_DATA1")
  expect(netlist).toContain("  - U1 pin15 (KBD_DATA1)")
  expect(netlist).toContain("- pin16(MOUSE_CLK1): NOT_CONNECTED")
})
