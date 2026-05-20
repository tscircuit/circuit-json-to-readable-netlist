import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { scorePhrase } from "lib/scorePhrase"
import { renderCircuit } from "tests/fixtures/render-circuit"

it("preserves Arduino shield pin labels in readable net names", () => {
  expect(scorePhrase("ARDUINO_D13")).toBeGreaterThan(scorePhrase("pin14"))
  expect(scorePhrase("ARDUINO_A0")).toBeGreaterThan(scorePhrase("pos"))
  expect(scorePhrase("SHIELD_IOREF")).toBeGreaterThan(scorePhrase("pin8"))

  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="dip28"
        manufacturerPartNumber="ATMEGA328P"
        pinLabels={{
          pin1: ["ARDUINO_D13"],
          pin2: ["ARDUINO_A0"],
          pin3: ["SHIELD_IOREF"],
          pin4: ["UNO_SCL"],
        }}
      />
      <resistor resistance="330" footprint="0402" name="R1" />
      <capacitor capacitance="100nF" footprint="0402" name="C1" />

      <trace from=".U1 .ARDUINO_D13" to=".R1 > .pin1" />
      <trace from=".U1 .ARDUINO_A0" to=".C1 > .pin1" />
    </board>,
  )

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_ARDUINO_D13")
  expect(netlist).toContain("  - U1 ARDUINO_D13")
  expect(netlist).toContain("NET: U1_ARDUINO_A0")
  expect(netlist).toContain("  - U1 ARDUINO_A0")
})
