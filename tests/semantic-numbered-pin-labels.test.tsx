import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

it("keeps semantic numbered chip labels ahead of generic physical pins", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="soic8"
        manufacturerPartNumber="ATMEGA328P"
        pinLabels={{
          pin1: ["GPIO1", "SCL"],
          pin2: ["GPIO2", "SDA"],
          pin3: ["GPIO3"],
        }}
      />
      <resistor resistance="10k" footprint="0402" name="R1" />
      <capacitor capacitance="100nF" footprint="0402" name="C1" />

      <trace from=".U1 .GPIO1" to=".R1 > .pin1" />
      <trace from=".U1 .GPIO2" to=".C1 > .pin1" />
    </board>,
  )

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_SCL")
  expect(netlist).toContain("  - U1 GPIO1 (SCL)")
  expect(netlist).toContain("- pin1(GPIO1, SCL): NETS(U1_SCL)")
  expect(netlist).toContain("NET: U1_SDA")
  expect(netlist).toContain("  - U1 GPIO2 (SDA)")
  expect(netlist).toContain("- pin2(GPIO2, SDA): NETS(U1_SDA)")
})
