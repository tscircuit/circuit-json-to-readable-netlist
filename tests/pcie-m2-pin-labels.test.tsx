import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

it("scores PCIe and M.2 pin aliases", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="J1"
        footprint="qfn16"
        manufacturerPartNumber="M2-KEY-M"
        pinLabels={{
          pin1: ["PETp0"],
          pin2: ["PERn0"],
          pin3: ["REFCLK_P0"],
          pin4: ["CLKREQ_N"],
          pin5: ["PERST_N"],
        }}
      />
      <capacitor capacitance="1nF" footprint="0402" name="C1" />
      <capacitor capacitance="1nF" footprint="0402" name="C2" />
      <capacitor capacitance="1nF" footprint="0402" name="C3" />
      <capacitor capacitance="1nF" footprint="0402" name="C4" />
      <capacitor capacitance="1nF" footprint="0402" name="C5" />

      <trace from=".J1 .PETp0" to=".C1 .pin1" />
      <trace from=".J1 .PERn0" to=".C2 .pin1" />
      <trace from=".J1 .REFCLK_P0" to=".C3 .pin1" />
      <trace from=".J1 .CLKREQ_N" to=".C4 .pin1" />
      <trace from=".J1 .PERST_N" to=".C5 .pin1" />
    </board>,
  )

  const readableNetlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(readableNetlist).toContain("NET: J1_PETp0")
  expect(readableNetlist).toContain("NET: J1_PERn0")
  expect(readableNetlist).toContain("NET: J1_REFCLK_P0")
  expect(readableNetlist).toContain("NET: J1_CLKREQ_N")
  expect(readableNetlist).toContain("NET: J1_PERST_N")
})
