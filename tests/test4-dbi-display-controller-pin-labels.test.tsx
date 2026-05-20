import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

it("test4 should preserve DBI display controller labels", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="qfn48"
        manufacturerPartNumber="ILI9341"
        pinLabels={{
          pin1: ["ILI9341_WR1"],
          pin2: ["ST7789_DC1"],
          pin3: ["ST7735_RD1"],
          pin4: ["MIPI_DBI_D0"],
          pin5: ["LCD_8080_D1"],
          pin6: ["DBI_TE1"],
        }}
      />
      <resistor resistance="1k" footprint="0402" name="R1" />
      <resistor resistance="1k" footprint="0402" name="R2" />
      <resistor resistance="1k" footprint="0402" name="R3" />
      <resistor resistance="1k" footprint="0402" name="R4" />
      <resistor resistance="1k" footprint="0402" name="R5" />
      <resistor resistance="1k" footprint="0402" name="R6" />

      <trace from=".U1 .ILI9341_WR1" to=".R1 > .pin1" />
      <trace from=".U1 .ST7789_DC1" to=".R2 > .pin1" />
      <trace from=".U1 .ST7735_RD1" to=".R3 > .pin1" />
      <trace from=".U1 .MIPI_DBI_D0" to=".R4 > .pin1" />
      <trace from=".U1 .LCD_8080_D1" to=".R5 > .pin1" />
      <trace from=".U1 .DBI_TE1" to=".R6 > .pin1" />
    </board>,
  )

  const readableNetlist = convertCircuitJsonToReadableNetlist(circuitJson)

  for (const label of [
    "ILI9341_WR1",
    "ST7789_DC1",
    "ST7735_RD1",
    "MIPI_DBI_D0",
    "LCD_8080_D1",
    "DBI_TE1",
  ]) {
    expect(readableNetlist).toContain(`NET: U1_${label}`)
    expect(readableNetlist).toContain(`NETS(U1_${label})`)
  }

  expect(readableNetlist).not.toContain("NET: U1_pin")
})
