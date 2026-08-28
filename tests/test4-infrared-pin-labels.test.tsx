import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

it("preserves infrared remote and IrDA aliases on generic chip pins", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="soic16"
        manufacturerPartNumber="IR-CONTROLLER"
        pinLabels={{
          pin14: ["IR_LED1"],
          pin15: ["IRDA_SD"],
        }}
      />
      <resistor resistance="100Ω" footprint="0402" name="R1" />
      <resistor resistance="10kΩ" footprint="0402" name="R2" />

      <trace from=".U1 .IR_LED1" to=".R1 > .pin1" />
      <trace from=".U1 .IRDA_SD" to=".R2 > .pin1" />
    </board>,
  )
  for (const element of circuitJson as any[]) {
    if (element.type !== "source_port") continue
    if (element.name === "IR_LED1") {
      element.name = "pin14"
      element.port_hints = ["IR_LED1"]
    }
    if (element.name === "IRDA_SD") {
      element.name = "pin15"
      element.port_hints = ["IRDA_SD"]
    }
  }

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_IR_LED1")
  expect(netlist).toContain("  - U1 pin14 (IR_LED1)")
  expect(netlist).toContain("NET: U1_IRDA_SD")
  expect(netlist).toContain("  - U1 pin15 (IRDA_SD)")
})
