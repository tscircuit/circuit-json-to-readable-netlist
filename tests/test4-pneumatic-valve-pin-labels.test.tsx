import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

it("scores pneumatic valve control pin labels over generic GPIO aliases", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="soic8"
        manufacturerPartNumber="PNEU-VALVE-CTRL"
        pinLabels={{
          pin1: ["GPIO1", "SOLENOID_VALVE1"],
          pin2: ["GPIO2", "VALVE_OPEN1"],
          pin3: ["GPIO3", "VALVE_CLOSE1"],
          pin4: ["GPIO4", "PROPORTIONAL_VALVE1"],
          pin5: ["GPIO5", "AIR_PRESSURE1"],
          pin6: ["GPIO6", "PNEUMATIC_ENABLE1"],
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

  expect(readableNetlist).toContain("NET: U1_SOLENOID_VALVE1")
  expect(readableNetlist).toContain("NET: U1_VALVE_OPEN1")
  expect(readableNetlist).toContain("NET: U1_VALVE_CLOSE1")
  expect(readableNetlist).toContain("NET: U1_PROPORTIONAL_VALVE1")
  expect(readableNetlist).toContain("NET: U1_AIR_PRESSURE1")
  expect(readableNetlist).toContain("NET: U1_PNEUMATIC_ENABLE1")
})
