import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

it("scores substation automation pin labels", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="qfn32"
        manufacturerPartNumber="SUBSTATION-CTRL"
        pinLabels={{
          pin1: ["pin14", "DNP3_TX1"],
          pin2: ["pin15", "IEC61850_GOOSE1"],
          pin3: ["pin16", "GOOSE_TRIP1"],
        }}
      />
      <resistor resistance="100" footprint="0402" name="R1" />
      <capacitor capacitance="100nF" footprint="0402" name="C1" />

      <trace from=".U1 .DNP3_TX1" to=".R1 > .pin1" />
      <trace from=".U1 .IEC61850_GOOSE1" to=".R1 > .pin2" />
      <trace from=".U1 .GOOSE_TRIP1" to=".C1 > .pin1" />
    </board>,
  )

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_DNP3_TX1")
  expect(netlist).toContain("  - U1 pin14 (DNP3_TX1)")
  expect(netlist).toContain("- pin1(pin14, DNP3_TX1): NETS(U1_DNP3_TX1)")

  expect(netlist).toContain("NET: U1_IEC61850_GOOSE1")
  expect(netlist).toContain("  - U1 pin15 (IEC61850_GOOSE1)")

  expect(netlist).toContain("NET: U1_GOOSE_TRIP1")
  expect(netlist).toContain("  - U1 pin16 (GOOSE_TRIP1)")
  expect(netlist).toContain("- pin3(pin16, GOOSE_TRIP1): NETS(U1_GOOSE_TRIP1)")
})
