import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

it("scores HSIC and UTMI USB PHY pin labels before numeric fallback", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="qfn64"
        manufacturerPartNumber="USB3320"
        pinLabels={{
          pin1: ["HSIC_DATA1"],
          pin2: ["HSIC_STROBE1"],
          pin3: ["UTMI_TXVALID1"],
          pin4: ["UTMI_RXACTIVE1"],
          pin5: ["UTMI_LINESTATE0"],
          pin6: ["UTMI_XCVRSELECT1"],
        }}
      />
      <resistor resistance="1k" footprint="0402" name="R1" />
      <resistor resistance="2k" footprint="0402" name="R2" />
      <resistor resistance="3k" footprint="0402" name="R3" />
      <resistor resistance="4k" footprint="0402" name="R4" />
      <resistor resistance="5k" footprint="0402" name="R5" />
      <resistor resistance="6k" footprint="0402" name="R6" />

      <trace from=".U1 .HSIC_DATA1" to=".R1 > .pin1" />
      <trace from=".U1 .HSIC_STROBE1" to=".R2 > .pin1" />
      <trace from=".U1 .UTMI_TXVALID1" to=".R3 > .pin1" />
      <trace from=".U1 .UTMI_RXACTIVE1" to=".R4 > .pin1" />
      <trace from=".U1 .UTMI_LINESTATE0" to=".R5 > .pin1" />
      <trace from=".U1 .UTMI_XCVRSELECT1" to=".R6 > .pin1" />
    </board>,
  )

  const readableNetlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(readableNetlist).toContain("NET: U1_HSIC_DATA1")
  expect(readableNetlist).toContain("NET: U1_HSIC_STROBE1")
  expect(readableNetlist).toContain("NET: U1_UTMI_TXVALID1")
  expect(readableNetlist).toContain("NET: U1_UTMI_RXACTIVE1")
  expect(readableNetlist).toContain("NET: U1_UTMI_LINESTATE0")
  expect(readableNetlist).toContain("NET: U1_UTMI_XCVRSELECT1")
  expect(readableNetlist).toContain("- pin1(HSIC_DATA1): NETS(U1_HSIC_DATA1)")
  expect(readableNetlist).toContain(
    "- pin2(HSIC_STROBE1): NETS(U1_HSIC_STROBE1)",
  )
  expect(readableNetlist).toContain(
    "- pin3(UTMI_TXVALID1): NETS(U1_UTMI_TXVALID1)",
  )
  expect(readableNetlist).toContain(
    "- pin4(UTMI_RXACTIVE1): NETS(U1_UTMI_RXACTIVE1)",
  )
  expect(readableNetlist).toContain(
    "- pin5(UTMI_LINESTATE0): NETS(U1_UTMI_LINESTATE0)",
  )
  expect(readableNetlist).toContain(
    "- pin6(UTMI_XCVRSELECT1): NETS(U1_UTMI_XCVRSELECT1)",
  )
})
