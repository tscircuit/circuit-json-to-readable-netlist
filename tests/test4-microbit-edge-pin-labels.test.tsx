import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { scorePhrase } from "lib/scorePhrase"
import { renderCircuit } from "tests/fixtures/render-circuit"

it("preserves microbit edge connector pin labels in readable net names", () => {
  expect(scorePhrase("MICROBIT_P0")).toBeGreaterThan(scorePhrase("pin14"))
  expect(scorePhrase("EDGE_P1")).toBeGreaterThan(scorePhrase("pos"))
  expect(scorePhrase("MICROBIT_LOGO")).toBeGreaterThan(scorePhrase("pin8"))

  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="dip28"
        manufacturerPartNumber="BBC micro:bit edge connector"
        pinLabels={{
          pin1: ["MICROBIT_P0"],
          pin2: ["EDGE_P1"],
          pin3: ["MICROBIT_LOGO"],
          pin4: ["MICROBIT_BUTTON_A"],
        }}
      />
      <resistor resistance="10k" footprint="0402" name="R1" />
      <capacitor capacitance="1uF" footprint="0402" name="C1" />

      <trace from=".U1 .MICROBIT_P0" to=".R1 > .pin1" />
      <trace from=".U1 .EDGE_P1" to=".C1 > .pin1" />
    </board>,
  )

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_MICROBIT_P0")
  expect(netlist).toContain("  - U1 MICROBIT_P0")
  expect(netlist).toContain("NET: U1_EDGE_P1")
  expect(netlist).toContain("  - U1 EDGE_P1")
})
