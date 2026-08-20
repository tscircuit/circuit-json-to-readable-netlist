import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

it("uses timing and timecode aliases instead of generic numbered pin labels", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="soic16"
        manufacturerPartNumber="TIME-SYNC-IC"
        pinLabels={{
          pin14: ["PTP_1588", "IRIGB1", "1PPS"],
        }}
      />
      <resistor resistance="10k" footprint="0402" name="R1" />

      <trace from=".U1 .PTP_1588" to=".R1 .pin1" />
    </board>,
  )

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_PTP_1588")
  expect(netlist).toContain("U1 PTP_1588 (IRIGB1,1PPS)")
  expect(netlist).toContain(
    "- pin14(PTP_1588, IRIGB1, 1PPS): NETS(U1_PTP_1588)",
  )
})
