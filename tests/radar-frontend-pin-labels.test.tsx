import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

it("preserves radar frontend aliases in readable netlists", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="qfn32"
        manufacturerPartNumber="RADAR-FRONTEND"
        pinLabels={{
          pin14: ["pin14", "RADAR_TX1"],
          pin15: ["pin15", "IF_OUT1"],
          pin16: ["pin16", "MIXER_LO1"],
        }}
      />
      <resistor name="R1" resistance="50" footprint="0402" />
      <capacitor name="C1" capacitance="100nF" footprint="0402" />
      <trace from=".U1 .RADAR_TX1" to=".R1 .pin1" />
      <trace from=".U1 .IF_OUT1" to=".C1 .pin1" />
    </board>,
  )

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_RADAR_TX1")
  expect(netlist).toContain("  - U1 pin14 (RADAR_TX1)")
  expect(netlist).toContain("NET: U1_IF_OUT1")
  expect(netlist).toContain("  - U1 pin15 (IF_OUT1)")
  expect(netlist).toContain("- pin16(MIXER_LO1): NOT_CONNECTED")
})
