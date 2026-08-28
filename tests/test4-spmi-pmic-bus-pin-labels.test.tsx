import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

it("scores SPMI PMIC bus pin labels before numeric fallback", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="qfn64"
        manufacturerPartNumber="PMIC-ARB"
        pinLabels={{
          pin1: ["SPMI_CLK1"],
          pin2: ["SPMI_DATA1"],
          pin3: ["SSBI_CLK1"],
          pin4: ["SSBI_DATA1"],
          pin5: ["PMIC_ARB_IRQ1"],
          pin6: ["PMICARB_ACK1"],
        }}
      />
      <resistor resistance="1k" footprint="0402" name="R1" />
      <resistor resistance="2k" footprint="0402" name="R2" />
      <resistor resistance="3k" footprint="0402" name="R3" />
      <resistor resistance="4k" footprint="0402" name="R4" />
      <resistor resistance="5k" footprint="0402" name="R5" />
      <resistor resistance="6k" footprint="0402" name="R6" />

      <trace from=".U1 .SPMI_CLK1" to=".R1 > .pin1" />
      <trace from=".U1 .SPMI_DATA1" to=".R2 > .pin1" />
      <trace from=".U1 .SSBI_CLK1" to=".R3 > .pin1" />
      <trace from=".U1 .SSBI_DATA1" to=".R4 > .pin1" />
      <trace from=".U1 .PMIC_ARB_IRQ1" to=".R5 > .pin1" />
      <trace from=".U1 .PMICARB_ACK1" to=".R6 > .pin1" />
    </board>,
  )

  const readableNetlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(readableNetlist).toContain("NET: U1_SPMI_CLK1")
  expect(readableNetlist).toContain("NET: U1_SPMI_DATA1")
  expect(readableNetlist).toContain("NET: U1_SSBI_CLK1")
  expect(readableNetlist).toContain("NET: U1_SSBI_DATA1")
  expect(readableNetlist).toContain("NET: U1_PMIC_ARB_IRQ1")
  expect(readableNetlist).toContain("NET: U1_PMICARB_ACK1")
  expect(readableNetlist).toContain("- pin1(SPMI_CLK1): NETS(U1_SPMI_CLK1)")
  expect(readableNetlist).toContain("- pin2(SPMI_DATA1): NETS(U1_SPMI_DATA1)")
  expect(readableNetlist).toContain(
    "- pin5(PMIC_ARB_IRQ1): NETS(U1_PMIC_ARB_IRQ1)",
  )
  expect(readableNetlist).toContain(
    "- pin6(PMICARB_ACK1): NETS(U1_PMICARB_ACK1)",
  )
})
