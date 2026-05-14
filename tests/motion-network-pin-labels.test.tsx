import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

it("scores industrial motion network pin labels", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="qfn32"
        manufacturerPartNumber="MOTION-NET"
        pinLabels={{
          pin1: ["pin14", "SERCOS_TX1"],
          pin2: ["pin15", "MECHATROLINK_DATA1"],
          pin3: ["pin16", "POWERLINK_SYNC1"],
        }}
      />
      <resistor resistance="100" footprint="0402" name="R1" />
      <capacitor capacitance="100nF" footprint="0402" name="C1" />

      <trace from=".U1 .SERCOS_TX1" to=".R1 > .pin1" />
      <trace from=".U1 .MECHATROLINK_DATA1" to=".R1 > .pin2" />
      <trace from=".U1 .POWERLINK_SYNC1" to=".C1 > .pin1" />
    </board>,
  )

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_SERCOS_TX1")
  expect(netlist).toContain("  - U1 pin14 (SERCOS_TX1)")
  expect(netlist).toContain("- pin1(pin14, SERCOS_TX1): NETS(U1_SERCOS_TX1)")

  expect(netlist).toContain("NET: U1_MECHATROLINK_DATA1")
  expect(netlist).toContain("  - U1 pin15 (MECHATROLINK_DATA1)")

  expect(netlist).toContain("NET: U1_POWERLINK_SYNC1")
  expect(netlist).toContain("  - U1 pin16 (POWERLINK_SYNC1)")
  expect(netlist).toContain(
    "- pin3(pin16, POWERLINK_SYNC1): NETS(U1_POWERLINK_SYNC1)",
  )
})
