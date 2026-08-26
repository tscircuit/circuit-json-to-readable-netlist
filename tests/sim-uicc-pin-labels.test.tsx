import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

it("includes SIM and UICC aliases for generic chip pins", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="qfn32"
        manufacturerPartNumber="CELLULAR_MODEM"
        pinLabels={{
          pin14: ["pin14", "SIM_IO"],
        }}
      />
      <resistor resistance="22Ω" footprint="0402" name="R1" />

      <trace from=".U1 .pin14" to=".R1 > .pin1" />
    </board>,
  )

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_SIM_IO")
  expect(netlist).toContain("  - U1 pin14 (SIM_IO)")
})
