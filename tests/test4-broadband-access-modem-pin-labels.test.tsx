import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

it("scores broadband access modem pin labels before numeric fallback", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="qfn64"
        manufacturerPartNumber="BCM63138"
        pinLabels={{
          pin1: ["XDSL_LINE1"],
          pin2: ["VDSL_TX1"],
          pin3: ["GFAST_SYNC1"],
          pin4: ["DOCSIS_DS_LOCK1"],
          pin5: ["MOCA_RF1"],
          pin6: ["CABLEMODEM_IRQ1"],
        }}
      />
      <resistor resistance="1k" footprint="0402" name="R1" />
      <resistor resistance="2k" footprint="0402" name="R2" />
      <resistor resistance="3k" footprint="0402" name="R3" />
      <resistor resistance="4k" footprint="0402" name="R4" />
      <resistor resistance="5k" footprint="0402" name="R5" />
      <resistor resistance="6k" footprint="0402" name="R6" />

      <trace from=".U1 .XDSL_LINE1" to=".R1 > .pin1" />
      <trace from=".U1 .VDSL_TX1" to=".R2 > .pin1" />
      <trace from=".U1 .GFAST_SYNC1" to=".R3 > .pin1" />
      <trace from=".U1 .DOCSIS_DS_LOCK1" to=".R4 > .pin1" />
      <trace from=".U1 .MOCA_RF1" to=".R5 > .pin1" />
      <trace from=".U1 .CABLEMODEM_IRQ1" to=".R6 > .pin1" />
    </board>,
  )

  const readableNetlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(readableNetlist).toContain("NET: U1_XDSL_LINE1")
  expect(readableNetlist).toContain("NET: U1_VDSL_TX1")
  expect(readableNetlist).toContain("NET: U1_GFAST_SYNC1")
  expect(readableNetlist).toContain("NET: U1_DOCSIS_DS_LOCK1")
  expect(readableNetlist).toContain("NET: U1_MOCA_RF1")
  expect(readableNetlist).toContain("NET: U1_CABLEMODEM_IRQ1")
  expect(readableNetlist).toContain("- pin1(XDSL_LINE1): NETS(U1_XDSL_LINE1)")
  expect(readableNetlist).toContain("- pin2(VDSL_TX1): NETS(U1_VDSL_TX1)")
  expect(readableNetlist).toContain(
    "- pin4(DOCSIS_DS_LOCK1): NETS(U1_DOCSIS_DS_LOCK1)",
  )
  expect(readableNetlist).toContain("- pin5(MOCA_RF1): NETS(U1_MOCA_RF1)")
})
