import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { scorePhrase } from "lib/scorePhrase"
import { renderCircuit } from "tests/fixtures/render-circuit"

it("scores clock-buffer fanout aliases above passive labels", () => {
  expect(scorePhrase("CLKBUF_OUT1")).toBeGreaterThan(scorePhrase("pos"))
  expect(scorePhrase("FANOUT_CLK1")).toBeGreaterThan(scorePhrase("pos"))
  expect(scorePhrase("ZERO_DELAY_OUT1")).toBeGreaterThan(scorePhrase("pos"))
  expect(scorePhrase("ZDB_OUT1")).toBeGreaterThan(scorePhrase("pos"))
})

it("preserves clock-buffer fanout labels in readable netlists", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="qfn24"
        manufacturerPartNumber="CLK-FANOUT"
        pinLabels={{
          pin1: ["CLKBUF_OUT1"],
          pin2: ["FANOUT_CLK1"],
        }}
      />
      <resistor resistance="49.9" footprint="0402" name="R1" />
      <resistor resistance="49.9" footprint="0402" name="R2" />

      <trace from=".U1 .CLKBUF_OUT1" to=".R1 > .pin1" />
      <trace from=".U1 .FANOUT_CLK1" to=".R2 > .pin1" />
    </board>,
  )

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_CLKBUF_OUT1")
  expect(netlist).toContain("  - U1 CLKBUF_OUT1")
  expect(netlist).toContain("- pin1(CLKBUF_OUT1): NETS(U1_CLKBUF_OUT1)")
  expect(netlist).toContain("NET: U1_FANOUT_CLK1")
  expect(netlist).toContain("  - U1 FANOUT_CLK1")
  expect(netlist).toContain("- pin2(FANOUT_CLK1): NETS(U1_FANOUT_CLK1)")
})
