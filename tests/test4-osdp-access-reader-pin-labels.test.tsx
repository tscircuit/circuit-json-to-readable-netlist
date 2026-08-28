import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

it("uses OSDP access-reader labels as readable net names", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="soic8"
        manufacturerPartNumber="OSDP_ACCESS_READER"
        pinLabels={{
          pin1: ["OSDP_A1"],
          pin2: ["OSDP_B1"],
          pin3: ["OSDP_TXEN1"],
          pin4: ["OSDP_POLL1"],
          pin5: ["READER_TAMPER1"],
          pin6: ["CARD_PRESENT1"],
        }}
      />
      <resistor name="R1" resistance="1k" footprint="0402" />
      <resistor name="R2" resistance="1k" footprint="0402" />
      <resistor name="R3" resistance="1k" footprint="0402" />
      <resistor name="R4" resistance="1k" footprint="0402" />
      <resistor name="R5" resistance="1k" footprint="0402" />
      <resistor name="R6" resistance="1k" footprint="0402" />

      <trace from=".U1 .OSDP_A1" to=".R1 .pin1" />
      <trace from=".U1 .OSDP_B1" to=".R2 .pin1" />
      <trace from=".U1 .OSDP_TXEN1" to=".R3 .pin1" />
      <trace from=".U1 .OSDP_POLL1" to=".R4 .pin1" />
      <trace from=".U1 .READER_TAMPER1" to=".R5 .pin1" />
      <trace from=".U1 .CARD_PRESENT1" to=".R6 .pin1" />
    </board>,
  )

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_OSDP_A1")
  expect(netlist).toContain("NET: U1_OSDP_B1")
  expect(netlist).toContain("NET: U1_OSDP_TXEN1")
  expect(netlist).toContain("NET: U1_OSDP_POLL1")
  expect(netlist).toContain("NET: U1_READER_TAMPER1")
  expect(netlist).toContain("NET: U1_CARD_PRESENT1")
  expect(netlist).toContain("- pin1(OSDP_A1): NETS(U1_OSDP_A1)")
  expect(netlist).toContain("- pin6(CARD_PRESENT1): NETS(U1_CARD_PRESENT1)")
})
