import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

it("scores load-cell and strain-gauge aliases before generic digit fallback", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="soic16"
        manufacturerPartNumber="HX711"
        pinLabels={{
          pin1: ["LOADCELL_EXC1"],
          pin2: ["STRAIN_GAUGE1"],
          pin3: ["BRIDGE_OUT1"],
        }}
      />
      <resistor resistance="1k" footprint="0402" name="R1" />

      <trace from=".U1 .LOADCELL_EXC1" to=".R1 > .pin1" />
      <trace from=".U1 .STRAIN_GAUGE1" to=".R1 > .pin2" />
    </board>,
  )

  const readableNetlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(readableNetlist).toContain("NET: U1_LOADCELL_EXC1")
  expect(readableNetlist).toContain("NET: U1_STRAIN_GAUGE1")
  expect(readableNetlist).toContain("  - U1 LOADCELL_EXC1")
  expect(readableNetlist).toContain("  - U1 STRAIN_GAUGE1")
  expect(readableNetlist).toContain(
    "- pin1(LOADCELL_EXC1): NETS(U1_LOADCELL_EXC1)",
  )
  expect(readableNetlist).toContain(
    "- pin2(STRAIN_GAUGE1): NETS(U1_STRAIN_GAUGE1)",
  )
})
