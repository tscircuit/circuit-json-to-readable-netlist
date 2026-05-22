import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

it("scores pool and spa controller pin labels over generic GPIO aliases", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="soic8"
        manufacturerPartNumber="SPA-CTRL"
        pinLabels={{
          pin1: ["GPIO1", "CHLORINATOR1"],
          pin2: ["GPIO2", "SALT_CELL1"],
          pin3: ["GPIO3", "SPA_BLOWER1"],
          pin4: ["GPIO4", "FILTER_PUMP1"],
          pin5: ["GPIO5", "HEATER_FIRE1"],
          pin6: ["GPIO6", "COVER_SWITCH1"],
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

  expect(readableNetlist).toContain("NET: U1_CHLORINATOR1")
  expect(readableNetlist).toContain("NET: U1_SALT_CELL1")
  expect(readableNetlist).toContain("NET: U1_SPA_BLOWER1")
  expect(readableNetlist).toContain("NET: U1_FILTER_PUMP1")
  expect(readableNetlist).toContain("NET: U1_HEATER_FIRE1")
  expect(readableNetlist).toContain("NET: U1_COVER_SWITCH1")
})
