import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

it("test4 should preserve segment LCD driver labels in generated net names", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="soic16"
        manufacturerPartNumber="HT1621B"
        pinLabels={{
          pin1: ["LCD_SEG0"],
          pin2: ["LCD_COM1"],
          pin3: ["HT1621_SEG2"],
          pin4: ["HT1621_COM3"],
          pin5: ["VLCD1"],
          pin6: ["GLASS_LCD_BIAS1"],
        }}
      />
      <resistor resistance="1k" footprint="0402" name="R1" />
      <resistor resistance="1k" footprint="0402" name="R2" />
      <resistor resistance="1k" footprint="0402" name="R3" />
      <resistor resistance="1k" footprint="0402" name="R4" />
      <resistor resistance="1k" footprint="0402" name="R5" />
      <resistor resistance="1k" footprint="0402" name="R6" />

      <trace from=".U1 .LCD_SEG0" to=".R1 > .pin1" />
      <trace from=".U1 .LCD_COM1" to=".R2 > .pin1" />
      <trace from=".U1 .HT1621_SEG2" to=".R3 > .pin1" />
      <trace from=".U1 .HT1621_COM3" to=".R4 > .pin1" />
      <trace from=".U1 .VLCD1" to=".R5 > .pin1" />
      <trace from=".U1 .GLASS_LCD_BIAS1" to=".R6 > .pin1" />
    </board>,
  )

  const readableNetlist = convertCircuitJsonToReadableNetlist(circuitJson)

  for (const label of [
    "LCD_SEG0",
    "LCD_COM1",
    "HT1621_SEG2",
    "HT1621_COM3",
    "VLCD1",
    "GLASS_LCD_BIAS1",
  ]) {
    expect(readableNetlist).toContain(`NET: U1_${label}`)
    expect(readableNetlist).toContain(`NETS(U1_${label})`)
  }

  expect(readableNetlist).not.toContain("NET: U1_pin")
})
