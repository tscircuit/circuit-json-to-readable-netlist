import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { scorePhrase } from "lib/scorePhrase"
import { renderCircuit } from "tests/fixtures/render-circuit"

it("scores powerline communication modem pin labels before numeric fallback", () => {
  expect(scorePhrase("G3_PLC_TX1")).toBeGreaterThan(scorePhrase("pin14"))
  expect(scorePhrase("PRIME_PLC_RX1")).toBeGreaterThan(scorePhrase("pos"))
  expect(scorePhrase("HOMEPLUG_AV1")).toBeGreaterThan(scorePhrase("pin3"))
  expect(scorePhrase("IEEE1901_TX1")).toBeGreaterThan(scorePhrase("neg"))
})

it("keeps powerline modem labels in readable net names and pins", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="soic8"
        manufacturerPartNumber="POWERLINE-MODEM"
        pinLabels={{
          pin1: ["G3_PLC_TX1"],
          pin2: ["PRIME_PLC_RX1"],
          pin3: ["HOMEPLUG_AV1"],
          pin4: ["IEEE1901_TX1"],
          pin5: ["GPIO1"],
          pin6: ["VDD"],
          pin7: ["GND"],
          pin8: ["NC"],
        }}
      />
      <resistor resistance="1k" footprint="0402" name="R1" />
      <capacitor capacitance="1nF" footprint="0402" name="C1" />

      <trace from=".U1 .G3_PLC_TX1" to=".R1 .pin1" />
      <trace from=".U1 .PRIME_PLC_RX1" to=".C1 .pin1" />
    </board>,
  )

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_G3_PLC_TX1")
  expect(netlist).toContain("  - U1 G3_PLC_TX1")
  expect(netlist).toContain("NET: U1_PRIME_PLC_RX1")
  expect(netlist).toContain("  - U1 PRIME_PLC_RX1")
})
