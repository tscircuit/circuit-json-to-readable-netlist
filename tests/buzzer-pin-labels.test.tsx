import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

it("scores buzzer and piezo aliases above generic pin labels", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="soic8"
        manufacturerPartNumber="DRV8210"
        pinLabels={{
          pin1: ["pin14", "BUZZER1_PWM"],
          pin2: ["pin15", "PIEZO_DRIVE"],
          pin3: ["pin16", "BEEP_OUT"],
        }}
      />
      <resistor resistance="1k" footprint="0402" name="R1" />
      <resistor resistance="10k" footprint="0402" name="R2" />

      <trace from=".U1 .BUZZER1_PWM" to=".R1 .pin1" />
      <trace from=".U1 .PIEZO_DRIVE" to=".R1 .pin2" />
      <trace from=".U1 .BEEP_OUT" to=".R2 .pin1" />
    </board>,
  )

  const readableNetlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(readableNetlist).toContain("NET: U1_BUZZER1_PWM")
  expect(readableNetlist).toContain("NET: U1_PIEZO_DRIVE")
  expect(readableNetlist).toContain("NET: U1_BEEP_OUT")
  expect(readableNetlist).toContain("- U1 pin14 (BUZZER1_PWM)")
  expect(readableNetlist).toContain("- U1 pin15 (PIEZO_DRIVE)")
  expect(readableNetlist).toContain("- U1 pin16 (BEEP_OUT)")
})
