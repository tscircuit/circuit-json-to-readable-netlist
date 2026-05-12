import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

it("keeps e-paper display controller aliases in readable pin labels", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="soic16"
        manufacturerPartNumber="EPD_DRIVER"
        pinLabels={{
          pin14: ["GPIO14", "EPD_BUSY"],
          pin15: ["GPIO15", "EINK_RST"],
        }}
      />
      <resistor resistance="1k" footprint="0402" name="R1" />
      <capacitor capacitance="1nF" footprint="0402" name="C1" />

      <trace from=".U1 .GPIO14" to=".R1 .pin1" />
      <trace from=".U1 .GPIO15" to=".C1 .pin1" />
    </board>,
  )

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_EPD_BUSY")
  expect(netlist).toContain("  - U1 GPIO14 (EPD_BUSY)")
  expect(netlist).toContain("NET: U1_EINK_RST")
  expect(netlist).toContain("  - U1 GPIO15 (EINK_RST)")
})
