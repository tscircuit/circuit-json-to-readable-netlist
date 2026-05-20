import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { scorePhrase } from "lib/scorePhrase"
import { renderCircuit } from "tests/fixtures/render-circuit"

it("preserves resistive touchscreen pin labels in readable net names", () => {
  expect(scorePhrase("XPT2046_IRQ1")).toBeGreaterThan(scorePhrase("pos"))
  expect(scorePhrase("PENIRQ1")).toBeGreaterThan(scorePhrase("pin14"))
  expect(scorePhrase("ADS7843_IRQ1")).toBeGreaterThan(scorePhrase("pos"))

  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="soic8"
        manufacturerPartNumber="XPT2046"
        pinLabels={{
          pin1: ["XPT2046_IRQ1", "PENIRQ1"],
          pin2: ["ADS7843_IRQ1"],
        }}
      />
      <resistor resistance="1k" footprint="0402" name="R1" />

      <trace from=".U1 .XPT2046_IRQ1" to=".R1 > .pin1" />
    </board>,
  )

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_XPT2046_IRQ1")
  expect(netlist).toContain("  - U1 XPT2046_IRQ1 (PENIRQ1)")
  expect(netlist).not.toContain("NET: R1_pos")
})
