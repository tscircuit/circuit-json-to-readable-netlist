import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

it("preserves level translator control and rail aliases in net entries", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="soic16"
        manufacturerPartNumber="TXS0108E"
        pinLabels={{
          pin1: ["pin1", "VCCA"],
          pin2: ["pin2", "VCCB"],
          pin14: ["pin14", "DIR"],
          pin15: ["pin15", "OE"],
        }}
      />
      <chip
        name="J1"
        footprint="pinrow4"
        manufacturerPartNumber="CONN"
        pinLabels={{
          pin1: ["CTRL"],
          pin2: ["EN"],
          pin3: ["VA"],
          pin4: ["VB"],
        }}
      />

      <trace from=".U1 .pin14" to=".J1 .CTRL" />
      <trace from=".U1 .pin15" to=".J1 .EN" />
      <trace from=".U1 .pin1" to=".J1 .VA" />
      <trace from=".U1 .pin2" to=".J1 .VB" />
    </board>,
  )

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_DIR")
  expect(netlist).toContain("  - U1 pin14 (DIR)")
  expect(netlist).toContain("NET: U1_OE")
  expect(netlist).toContain("  - U1 pin15 (OE)")
  expect(netlist).toContain("NET: U1_VCCA")
  expect(netlist).toContain("  - U1 pin1 (VCCA)")
  expect(netlist).toContain("NET: U1_VCCB")
  expect(netlist).toContain("  - U1 pin2 (VCCB)")
})
