import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

it("uses heavy-vehicle network labels as readable net names", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="soic8"
        manufacturerPartNumber="HEAVY_VEHICLE_GATEWAY"
        pinLabels={{
          pin1: ["J1939_CANH1"],
          pin2: ["J1939_CANL1"],
          pin3: ["J1708_A1"],
          pin4: ["J1708_B1"],
          pin5: ["J1587_TX1"],
          pin6: ["J1587_RX1"],
        }}
      />
      <resistor name="R1" resistance="1k" footprint="0402" />
      <resistor name="R2" resistance="1k" footprint="0402" />
      <resistor name="R3" resistance="1k" footprint="0402" />
      <resistor name="R4" resistance="1k" footprint="0402" />
      <resistor name="R5" resistance="1k" footprint="0402" />
      <resistor name="R6" resistance="1k" footprint="0402" />

      <trace from=".U1 .J1939_CANH1" to=".R1 .pin1" />
      <trace from=".U1 .J1939_CANL1" to=".R2 .pin1" />
      <trace from=".U1 .J1708_A1" to=".R3 .pin1" />
      <trace from=".U1 .J1708_B1" to=".R4 .pin1" />
      <trace from=".U1 .J1587_TX1" to=".R5 .pin1" />
      <trace from=".U1 .J1587_RX1" to=".R6 .pin1" />
    </board>,
  )

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_J1939_CANH1")
  expect(netlist).toContain("NET: U1_J1939_CANL1")
  expect(netlist).toContain("NET: U1_J1708_A1")
  expect(netlist).toContain("NET: U1_J1708_B1")
  expect(netlist).toContain("NET: U1_J1587_TX1")
  expect(netlist).toContain("NET: U1_J1587_RX1")
  expect(netlist).toContain("- pin1(J1939_CANH1): NETS(U1_J1939_CANH1)")
  expect(netlist).toContain("- pin6(J1587_RX1): NETS(U1_J1587_RX1)")
})
