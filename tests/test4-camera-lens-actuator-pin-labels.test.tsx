import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

it("test4 should preserve camera lens actuator labels", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="qfn16"
        manufacturerPartNumber="LC898217"
        pinLabels={{
          pin1: ["VCM_OUT1"],
          pin2: ["VOICE_COIL_P1"],
          pin3: ["OIS_X1"],
          pin4: ["AUTOFOCUS_EN1"],
          pin5: ["AF_PWM1"],
          pin6: ["LENS_POS1"],
        }}
      />
      <resistor resistance="1k" footprint="0402" name="R1" />
      <resistor resistance="1k" footprint="0402" name="R2" />
      <resistor resistance="1k" footprint="0402" name="R3" />
      <resistor resistance="1k" footprint="0402" name="R4" />
      <resistor resistance="1k" footprint="0402" name="R5" />
      <resistor resistance="1k" footprint="0402" name="R6" />

      <trace from=".U1 .VCM_OUT1" to=".R1 > .pin1" />
      <trace from=".U1 .VOICE_COIL_P1" to=".R2 > .pin1" />
      <trace from=".U1 .OIS_X1" to=".R3 > .pin1" />
      <trace from=".U1 .AUTOFOCUS_EN1" to=".R4 > .pin1" />
      <trace from=".U1 .AF_PWM1" to=".R5 > .pin1" />
      <trace from=".U1 .LENS_POS1" to=".R6 > .pin1" />
    </board>,
  )

  const readableNetlist = convertCircuitJsonToReadableNetlist(circuitJson)

  for (const label of [
    "VCM_OUT1",
    "VOICE_COIL_P1",
    "OIS_X1",
    "AUTOFOCUS_EN1",
    "AF_PWM1",
    "LENS_POS1",
  ]) {
    expect(readableNetlist).toContain(`NET: U1_${label}`)
    expect(readableNetlist).toContain(`NETS(U1_${label})`)
  }

  expect(readableNetlist).not.toContain("NET: U1_pin")
})
