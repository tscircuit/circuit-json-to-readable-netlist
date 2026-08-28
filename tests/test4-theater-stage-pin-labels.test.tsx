import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

it("scores theater stage controller pin labels over generic GPIO aliases", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="soic8"
        manufacturerPartNumber="STAGE-CTRL"
        pinLabels={{
          pin1: ["GPIO1", "CURTAIN_MOTOR1"],
          pin2: ["GPIO2", "FLY_BAR1"],
          pin3: ["GPIO3", "HOUSE_LIGHT1"],
          pin4: ["GPIO4", "ORCHESTRA_PIT1"],
          pin5: ["GPIO5", "STAGE_LIFT1"],
          pin6: ["GPIO6", "PROSCENIUM1"],
          pin7: ["GND"],
          pin8: ["VDD"],
        }}
      />
      <resistor resistance="10k" footprint="0402" name="R1" />
      <resistor resistance="10k" footprint="0402" name="R2" />
      <resistor resistance="10k" footprint="0402" name="R3" />
      <resistor resistance="10k" footprint="0402" name="R4" />
      <resistor resistance="10k" footprint="0402" name="R5" />
      <resistor resistance="10k" footprint="0402" name="R6" />

      <trace from=".U1 .GPIO1" to=".R1 .pin1" />
      <trace from=".U1 .GPIO2" to=".R2 .pin1" />
      <trace from=".U1 .GPIO3" to=".R3 .pin1" />
      <trace from=".U1 .GPIO4" to=".R4 .pin1" />
      <trace from=".U1 .GPIO5" to=".R5 .pin1" />
      <trace from=".U1 .GPIO6" to=".R6 .pin1" />
    </board>,
  )

  const readableNetlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(readableNetlist).toContain("NET: U1_CURTAIN_MOTOR1")
  expect(readableNetlist).toContain("NET: U1_FLY_BAR1")
  expect(readableNetlist).toContain("NET: U1_HOUSE_LIGHT1")
  expect(readableNetlist).toContain("NET: U1_ORCHESTRA_PIT1")
  expect(readableNetlist).toContain("NET: U1_STAGE_LIFT1")
  expect(readableNetlist).toContain("NET: U1_PROSCENIUM1")
})
