import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

it("preserves ESD and EMI protection aliases over generic numbered pins", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="soic16"
        manufacturerPartNumber="TPD4E05U06"
        pinLabels={{
          pin14: ["IO1", "ESD_IO1"],
        }}
      />
      <chip
        name="FL1"
        footprint="soic16"
        manufacturerPartNumber="EMI_FILTER_ARRAY"
        pinLabels={{
          pin14: ["IN1", "EMI_FLT_IN"],
        }}
      />
      <resistor resistance="1k" footprint="0402" name="R1" />
      <capacitor capacitance="1nF" footprint="0402" name="C1" />

      <trace from=".U1 .IO1" to=".R1 .pin1" />
      <trace from=".FL1 .IN1" to=".C1 .pin1" />
    </board>,
  )

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_ESD_IO1")
  expect(netlist).toContain("  - U1 IO1 (ESD_IO1)")
  expect(netlist).toContain("- pin14(IO1, ESD_IO1): NETS(U1_ESD_IO1)")
  expect(netlist).toContain("NET: FL1_EMI_FLT_IN")
  expect(netlist).toContain("  - FL1 IN1 (EMI_FLT_IN)")
  expect(netlist).toContain("- pin14(IN1, EMI_FLT_IN): NETS(FL1_EMI_FLT_IN)")
})
