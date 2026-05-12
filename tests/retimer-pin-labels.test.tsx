import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { scorePhrase } from "lib/scorePhrase"
import { renderCircuit } from "tests/fixtures/render-circuit"

it("scores high-speed signal-conditioning aliases above passive labels", () => {
  expect(scorePhrase("RETIMER_RX1")).toBeGreaterThan(scorePhrase("pos"))
  expect(scorePhrase("REDRIVER_TX1")).toBeGreaterThan(scorePhrase("pos"))
  expect(scorePhrase("CTLE_OUT1")).toBeGreaterThan(scorePhrase("pos"))
  expect(scorePhrase("DFE_TAP1")).toBeGreaterThan(scorePhrase("pos"))
})

it("preserves high-speed signal-conditioning labels in readable netlists", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="qfn32"
        manufacturerPartNumber="HS-RETIMER"
        pinLabels={{
          pin1: ["RETIMER_RX1"],
          pin2: ["REDRIVER_TX1"],
        }}
      />
      <resistor resistance="100" footprint="0402" name="R1" />
      <resistor resistance="100" footprint="0402" name="R2" />

      <trace from=".U1 .RETIMER_RX1" to=".R1 > .pin1" />
      <trace from=".U1 .REDRIVER_TX1" to=".R2 > .pin1" />
    </board>,
  )

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_RETIMER_RX1")
  expect(netlist).toContain("  - U1 RETIMER_RX1")
  expect(netlist).toContain("- pin1(RETIMER_RX1): NETS(U1_RETIMER_RX1)")
  expect(netlist).toContain("NET: U1_REDRIVER_TX1")
  expect(netlist).toContain("  - U1 REDRIVER_TX1")
  expect(netlist).toContain("- pin2(REDRIVER_TX1): NETS(U1_REDRIVER_TX1)")
})
