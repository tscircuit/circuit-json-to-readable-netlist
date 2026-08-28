import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

it("uses common voltage rail labels instead of passive polarity hints", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="soic8"
        manufacturerPartNumber="TEST_CHIP"
        pinLabels={{
          pin1: ["3V3"],
        }}
      />
      <resistor resistance="1k" footprint="0402" name="R1" />
      <trace from=".U1 .3V3" to=".R1 .pin1" />
    </board>,
  )

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_3V3")
  expect(netlist).not.toContain("NET: R1_pos")
})
