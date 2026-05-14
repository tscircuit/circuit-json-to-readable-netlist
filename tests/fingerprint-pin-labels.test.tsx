import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

it("scores digit-bearing fingerprint sensor pin aliases", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="soic8"
        manufacturerPartNumber="FPM10A"
        pinLabels={{
          pin1: ["VCC"],
          pin2: ["GND"],
          pin3: ["FINGER_DETECT1"],
          pin4: ["FP_IRQ1"],
          pin5: ["IMG_RDY1"],
          pin6: ["UART_TX"],
          pin7: ["UART_RX"],
          pin8: ["RST"],
        }}
      />
      <resistor resistance="10k" footprint="0402" name="R1" />
      <resistor resistance="10k" footprint="0402" name="R2" />
      <resistor resistance="10k" footprint="0402" name="R3" />

      <trace from=".U1 .FINGER_DETECT1" to=".R1 > .pin1" />
      <trace from=".U1 .FP_IRQ1" to=".R2 > .pin1" />
      <trace from=".U1 .IMG_RDY1" to=".R3 > .pin1" />
    </board>,
  )

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_FINGER_DETECT1")
  expect(netlist).toContain("NET: U1_FP_IRQ1")
  expect(netlist).toContain("NET: U1_IMG_RDY1")
  expect(netlist).toContain("- U1 FINGER_DETECT1")
  expect(netlist).toContain("- U1 FP_IRQ1")
  expect(netlist).toContain("- U1 IMG_RDY1")
})
