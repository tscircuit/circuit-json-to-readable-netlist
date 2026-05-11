import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

it("preserves analog audio aliases on generic numbered pins", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="qfn28"
        manufacturerPartNumber="WM8960"
        pinLabels={{
          pin14: ["GPIO14", "SPK1_P"],
          pin15: ["GPIO15", "MICBIAS"],
        }}
      />
      <resistor resistance="10k" footprint="0402" name="R1" />
      <resistor resistance="10k" footprint="0402" name="R2" />

      <trace from=".U1 .GPIO14" to=".R1 > .pin1" />
      <trace from=".U1 .GPIO15" to=".R2 > .pin1" />
    </board>,
  )

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_SPK1_P")
  expect(netlist).toContain("NET: U1_MICBIAS")
  expect(netlist).toContain("U1 GPIO14 (SPK1_P)")
  expect(netlist).toContain("U1 GPIO15 (MICBIAS)")
})
