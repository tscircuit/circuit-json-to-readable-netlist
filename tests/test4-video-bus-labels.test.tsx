import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

it("preserves BT.656 and BT.1120 video bus labels in net names", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="soic8"
        manufacturerPartNumber="VIDEO-BRIDGE"
        pinLabels={{
          pin1: ["BT656_D0"],
          pin2: ["BT1120_Y7"],
          pin3: ["CCIR656_CLK1"],
          pin4: ["GND"],
        }}
      />
      <resistor resistance="1k" footprint="0402" name="R1" />
      <resistor resistance="1k" footprint="0402" name="R2" />
      <resistor resistance="1k" footprint="0402" name="R3" />

      <trace from=".U1 .BT656_D0" to=".R1 > .pin1" />
      <trace from=".U1 .BT1120_Y7" to=".R2 > .pin1" />
      <trace from=".U1 .CCIR656_CLK1" to=".R3 > .pin1" />
    </board>,
  )

  const readableNetlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(readableNetlist).toContain("NET: U1_BT656_D0")
  expect(readableNetlist).toContain("NET: U1_BT1120_Y7")
  expect(readableNetlist).toContain("NET: U1_CCIR656_CLK1")
  expect(readableNetlist).toContain("- pin1(BT656_D0): NETS(U1_BT656_D0)")
  expect(readableNetlist).toContain("- pin2(BT1120_Y7): NETS(U1_BT1120_Y7)")
  expect(readableNetlist).toContain(
    "- pin3(CCIR656_CLK1): NETS(U1_CCIR656_CLK1)",
  )
})
