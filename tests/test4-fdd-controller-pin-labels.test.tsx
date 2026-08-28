import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

it("test4 should preserve FDD controller labels", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="qfn44"
        manufacturerPartNumber="FDC37C665"
        pinLabels={{
          pin1: ["FDD_INDEX1"],
          pin2: ["FDD_TRACK0"],
          pin3: ["FDD_WRITE_GATE1"],
          pin4: ["FDD_MOTOR_ON1"],
          pin5: ["FDD_DRIVE_SELECT1"],
          pin6: ["FLOPPY_STEP1"],
        }}
      />
      <resistor resistance="1k" footprint="0402" name="R1" />
      <resistor resistance="1k" footprint="0402" name="R2" />
      <resistor resistance="1k" footprint="0402" name="R3" />
      <resistor resistance="1k" footprint="0402" name="R4" />
      <resistor resistance="1k" footprint="0402" name="R5" />
      <resistor resistance="1k" footprint="0402" name="R6" />

      <trace from=".U1 .FDD_INDEX1" to=".R1 > .pin1" />
      <trace from=".U1 .FDD_TRACK0" to=".R2 > .pin1" />
      <trace from=".U1 .FDD_WRITE_GATE1" to=".R3 > .pin1" />
      <trace from=".U1 .FDD_MOTOR_ON1" to=".R4 > .pin1" />
      <trace from=".U1 .FDD_DRIVE_SELECT1" to=".R5 > .pin1" />
      <trace from=".U1 .FLOPPY_STEP1" to=".R6 > .pin1" />
    </board>,
  )

  const readableNetlist = convertCircuitJsonToReadableNetlist(circuitJson)

  for (const label of [
    "FDD_INDEX1",
    "FDD_TRACK0",
    "FDD_WRITE_GATE1",
    "FDD_MOTOR_ON1",
    "FDD_DRIVE_SELECT1",
    "FLOPPY_STEP1",
  ]) {
    expect(readableNetlist).toContain(`NET: U1_${label}`)
    expect(readableNetlist).toContain(`NETS(U1_${label})`)
  }

  expect(readableNetlist).not.toContain("NET: U1_pin")
})
