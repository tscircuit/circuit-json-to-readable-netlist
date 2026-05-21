import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

it("preserves Centronics and parallel printer pin labels", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="soic8"
        manufacturerPartNumber="PARALLEL_PRINTER_IF"
        pinLabels={{
          pin1: ["CENTRONICS_STROBE1"],
          pin2: ["LPT_ACK1"],
          pin3: ["LPT_BUSY1"],
          pin4: ["PRINTER_DATA7"],
          pin5: ["PARPORT_SELECT1"],
          pin6: ["AUTOFEED1"],
        }}
      />
      <resistor resistance="1k" footprint="0402" name="R1" />
      <resistor resistance="1k" footprint="0402" name="R2" />
      <resistor resistance="1k" footprint="0402" name="R3" />
      <resistor resistance="1k" footprint="0402" name="R4" />
      <resistor resistance="1k" footprint="0402" name="R5" />
      <resistor resistance="1k" footprint="0402" name="R6" />

      <trace from=".U1 .CENTRONICS_STROBE1" to=".R1 .pin1" />
      <trace from=".U1 .LPT_ACK1" to=".R2 .pin1" />
      <trace from=".U1 .LPT_BUSY1" to=".R3 .pin1" />
      <trace from=".U1 .PRINTER_DATA7" to=".R4 .pin1" />
      <trace from=".U1 .PARPORT_SELECT1" to=".R5 .pin1" />
      <trace from=".U1 .AUTOFEED1" to=".R6 .pin1" />
    </board>,
  )

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_CENTRONICS_STROBE1")
  expect(netlist).toContain("NET: U1_LPT_ACK1")
  expect(netlist).toContain("NET: U1_LPT_BUSY1")
  expect(netlist).toContain("NET: U1_PRINTER_DATA7")
  expect(netlist).toContain("NET: U1_PARPORT_SELECT1")
  expect(netlist).toContain("NET: U1_AUTOFEED1")
  expect(netlist).toContain("- U1 CENTRONICS_STROBE1")
  expect(netlist).toContain("- U1 AUTOFEED1")
  expect(netlist).toContain(
    "- pin1(CENTRONICS_STROBE1): NETS(U1_CENTRONICS_STROBE1)",
  )
  expect(netlist).toContain("- pin6(AUTOFEED1): NETS(U1_AUTOFEED1)")
})
