import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

it("preserves vending payment interface pin labels in readable netlists", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="soic8"
        manufacturerPartNumber="VENDING-PAYMENT-CTRL"
        pinLabels={{
          pin1: ["MDB_RX1"],
          pin2: ["CCTALK_DATA1"],
          pin3: ["BILL_ACCEPTOR1"],
          pin4: ["CASHLESS_EN1"],
        }}
      />
      <resistor resistance="10k" footprint="0402" name="R1" />
      <resistor resistance="10k" footprint="0402" name="R2" />
      <resistor resistance="10k" footprint="0402" name="R3" />
      <resistor resistance="10k" footprint="0402" name="R4" />

      <trace from=".U1 .MDB_RX1" to=".R1 .pin1" />
      <trace from=".U1 .CCTALK_DATA1" to=".R2 .pin1" />
      <trace from=".U1 .BILL_ACCEPTOR1" to=".R3 .pin1" />
      <trace from=".U1 .CASHLESS_EN1" to=".R4 .pin1" />
    </board>,
  )

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_MDB_RX1")
  expect(netlist).toContain("NET: U1_CCTALK_DATA1")
  expect(netlist).toContain("NET: U1_BILL_ACCEPTOR1")
  expect(netlist).toContain("NET: U1_CASHLESS_EN1")
  expect(netlist).toContain("U1 MDB_RX1")
  expect(netlist).toContain("U1 CCTALK_DATA1")
  expect(netlist).toContain("U1 BILL_ACCEPTOR1")
  expect(netlist).toContain("U1 CASHLESS_EN1")
})
