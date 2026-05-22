import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

it("scores textile loom pin labels over generic GPIO aliases", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="soic8"
        manufacturerPartNumber="LOOM-CTRL"
        pinLabels={{
          pin1: ["GPIO1", "WARP_STOP1"],
          pin2: ["GPIO2", "WEFT_STOP1"],
          pin3: ["GPIO3", "SHUTTLE_POS1"],
          pin4: ["GPIO4", "LOOM_CLUTCH1"],
          pin5: ["GPIO5", "PICK_COUNT1"],
          pin6: ["GPIO6", "SELVEDGE_SENSOR1"],
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

  expect(readableNetlist).toContain("NET: U1_WARP_STOP1")
  expect(readableNetlist).toContain("NET: U1_WEFT_STOP1")
  expect(readableNetlist).toContain("NET: U1_SHUTTLE_POS1")
  expect(readableNetlist).toContain("NET: U1_LOOM_CLUTCH1")
  expect(readableNetlist).toContain("NET: U1_PICK_COUNT1")
  expect(readableNetlist).toContain("NET: U1_SELVEDGE_SENSOR1")
})
