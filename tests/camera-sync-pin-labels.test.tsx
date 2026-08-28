import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

it("preserves parallel camera control and sync pin labels", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="soic16"
        manufacturerPartNumber="OV2640"
        pinLabels={{
          pin14: ["pin14", "CAM_PWDN"],
          pin15: ["pin15", "DVP_D0", "VSYNC"],
        }}
      />
      <resistor resistance="10k" footprint="0402" name="R1" />
      <capacitor capacitance="100nF" footprint="0402" name="C1" />

      <trace from=".U1 .CAM_PWDN" to=".R1 .pin1" />
      <trace from=".U1 .DVP_D0" to=".C1 .pin1" />
    </board>,
  )

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_CAM_PWDN")
  expect(netlist).toContain("  - U1 pin14 (CAM_PWDN)")
  expect(netlist).toContain("NET: U1_DVP_D0")
  expect(netlist).toContain("  - U1 pin15 (DVP_D0,VSYNC)")
  expect(netlist).toContain("- pin15(DVP_D0, VSYNC): NETS(U1_DVP_D0)")
  expect(netlist).not.toContain("NET: U1_VSYNC")
})
