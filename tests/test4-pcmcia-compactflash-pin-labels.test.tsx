import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

it("preserves PCMCIA and CompactFlash pin labels", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="soic8"
        manufacturerPartNumber="PC_CARD_BRIDGE"
        pinLabels={{
          pin1: ["PCMCIA_REG1"],
          pin2: ["PCMCIA_CE1"],
          pin3: ["PCCARD_WAIT1"],
          pin4: ["CARDBUS_CCLK1"],
          pin5: ["CF_DASP1"],
          pin6: ["CF_IORDY1"],
        }}
      />
      <resistor resistance="1k" footprint="0402" name="R1" />
      <resistor resistance="1k" footprint="0402" name="R2" />
      <resistor resistance="1k" footprint="0402" name="R3" />
      <resistor resistance="1k" footprint="0402" name="R4" />
      <resistor resistance="1k" footprint="0402" name="R5" />
      <resistor resistance="1k" footprint="0402" name="R6" />

      <trace from=".U1 .PCMCIA_REG1" to=".R1 .pin1" />
      <trace from=".U1 .PCMCIA_CE1" to=".R2 .pin1" />
      <trace from=".U1 .PCCARD_WAIT1" to=".R3 .pin1" />
      <trace from=".U1 .CARDBUS_CCLK1" to=".R4 .pin1" />
      <trace from=".U1 .CF_DASP1" to=".R5 .pin1" />
      <trace from=".U1 .CF_IORDY1" to=".R6 .pin1" />
    </board>,
  )

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_PCMCIA_REG1")
  expect(netlist).toContain("NET: U1_PCMCIA_CE1")
  expect(netlist).toContain("NET: U1_PCCARD_WAIT1")
  expect(netlist).toContain("NET: U1_CARDBUS_CCLK1")
  expect(netlist).toContain("NET: U1_CF_DASP1")
  expect(netlist).toContain("NET: U1_CF_IORDY1")
  expect(netlist).toContain("- U1 PCMCIA_REG1")
  expect(netlist).toContain("- U1 CF_IORDY1")
  expect(netlist).toContain("- pin1(PCMCIA_REG1): NETS(U1_PCMCIA_REG1)")
  expect(netlist).toContain("- pin6(CF_IORDY1): NETS(U1_CF_IORDY1)")
})
