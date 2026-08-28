import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

it("scores USB serial bridge pin labels before numeric fallback", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="qfn32"
        manufacturerPartNumber="FT232R"
        pinLabels={{
          pin1: ["CBUS0"],
          pin2: ["CBUS1"],
          pin3: ["TXD0"],
          pin4: ["RXD0"],
          pin5: ["TXDEN"],
          pin6: ["TXLED"],
          pin7: ["RXLED"],
          pin8: ["PWREN"],
        }}
      />
      <resistor resistance="1k" footprint="0402" name="R1" />
      <resistor resistance="2k" footprint="0402" name="R2" />
      <resistor resistance="3k" footprint="0402" name="R3" />
      <resistor resistance="4k" footprint="0402" name="R4" />
      <resistor resistance="5k" footprint="0402" name="R5" />
      <resistor resistance="6k" footprint="0402" name="R6" />
      <resistor resistance="7k" footprint="0402" name="R7" />
      <resistor resistance="8k" footprint="0402" name="R8" />

      <trace from=".U1 .CBUS0" to=".R1 > .pin1" />
      <trace from=".U1 .CBUS1" to=".R2 > .pin1" />
      <trace from=".U1 .TXD0" to=".R3 > .pin1" />
      <trace from=".U1 .RXD0" to=".R4 > .pin1" />
      <trace from=".U1 .TXDEN" to=".R5 > .pin1" />
      <trace from=".U1 .TXLED" to=".R6 > .pin1" />
      <trace from=".U1 .RXLED" to=".R7 > .pin1" />
      <trace from=".U1 .PWREN" to=".R8 > .pin1" />
    </board>,
  )

  const readableNetlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(readableNetlist).toContain("NET: U1_CBUS0")
  expect(readableNetlist).toContain("NET: U1_CBUS1")
  expect(readableNetlist).toContain("NET: U1_TXD0")
  expect(readableNetlist).toContain("NET: U1_RXD0")
  expect(readableNetlist).toContain("NET: U1_TXDEN")
  expect(readableNetlist).toContain("NET: U1_TXLED")
  expect(readableNetlist).toContain("NET: U1_RXLED")
  expect(readableNetlist).toContain("NET: U1_PWREN")
  expect(readableNetlist).toContain("- pin1(CBUS0): NETS(U1_CBUS0)")
  expect(readableNetlist).toContain("- pin2(CBUS1): NETS(U1_CBUS1)")
  expect(readableNetlist).toContain("- pin3(TXD0): NETS(U1_TXD0)")
  expect(readableNetlist).toContain("- pin4(RXD0): NETS(U1_RXD0)")
})
