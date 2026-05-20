import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

it("test4 should preserve SCSI bus labels", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="qfn48"
        manufacturerPartNumber="NCR5380"
        pinLabels={{
          pin1: ["SCSI_REQ1"],
          pin2: ["SCSI_ACK1"],
          pin3: ["SCSI_BSY1"],
          pin4: ["SCSI_SEL1"],
          pin5: ["SCSI_ATN1"],
          pin6: ["SCSI_RST1"],
        }}
      />
      <resistor resistance="1k" footprint="0402" name="R1" />
      <resistor resistance="1k" footprint="0402" name="R2" />
      <resistor resistance="1k" footprint="0402" name="R3" />
      <resistor resistance="1k" footprint="0402" name="R4" />
      <resistor resistance="1k" footprint="0402" name="R5" />
      <resistor resistance="1k" footprint="0402" name="R6" />

      <trace from=".U1 .SCSI_REQ1" to=".R1 > .pin1" />
      <trace from=".U1 .SCSI_ACK1" to=".R2 > .pin1" />
      <trace from=".U1 .SCSI_BSY1" to=".R3 > .pin1" />
      <trace from=".U1 .SCSI_SEL1" to=".R4 > .pin1" />
      <trace from=".U1 .SCSI_ATN1" to=".R5 > .pin1" />
      <trace from=".U1 .SCSI_RST1" to=".R6 > .pin1" />
    </board>,
  )

  const readableNetlist = convertCircuitJsonToReadableNetlist(circuitJson)

  for (const label of [
    "SCSI_REQ1",
    "SCSI_ACK1",
    "SCSI_BSY1",
    "SCSI_SEL1",
    "SCSI_ATN1",
    "SCSI_RST1",
  ]) {
    expect(readableNetlist).toContain(`NET: U1_${label}`)
    expect(readableNetlist).toContain(`NETS(U1_${label})`)
  }

  expect(readableNetlist).not.toContain("NET: U1_pin")
})
