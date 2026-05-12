import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

it("preserves marine NMEA pin labels in readable netlists", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="soic8"
        pinLabels={{
          pin1: ["pin14", "NMEA0183_TX1"],
          pin2: ["pin15", "NMEA2000_CANH"],
        }}
      />
      <resistor resistance="1k" footprint="0402" name="R1" />
      <capacitor capacitance="1nF" footprint="0402" name="C1" />

      <trace from=".U1 .pin14" to=".R1 .pin1" />
      <trace from=".U1 .pin15" to=".C1 .pin1" />
    </board>,
  )

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_NMEA0183_TX1")
  expect(netlist).toContain("  - U1 pin14 (NMEA0183_TX1)")
  expect(netlist).toContain("NET: U1_NMEA2000_CANH")
  expect(netlist).toContain("  - U1 pin15 (NMEA2000_CANH)")
  expect(netlist).not.toContain("NET: R1_pos")
  expect(netlist).not.toContain("NET: C1_pos")
})
