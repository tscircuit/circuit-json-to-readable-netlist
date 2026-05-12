import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { scorePhrase } from "lib/scorePhrase"
import { renderCircuit } from "tests/fixtures/render-circuit"

it("keeps I2S audio bus labels ahead of generic numbered pins", () => {
  expect(scorePhrase("I2S_BCLK1")).toBeGreaterThan(scorePhrase("pin14"))
  expect(scorePhrase("audio_mclk1")).toBeGreaterThan(scorePhrase("pos"))

  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="soic16"
        manufacturerPartNumber="PCM5102A"
        pinLabels={{
          pin14: ["I2S_BCLK1", "AUDIO_MCLK1"],
        }}
      />
      <capacitor capacitance="100nF" footprint="0402" name="C1" />

      <trace from=".U1 .I2S_BCLK1" to=".C1 .pin1" />
    </board>,
  )

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_I2S_BCLK1")
  expect(netlist).not.toContain("NET: C1_pos")
  expect(netlist).toContain("U1 I2S_BCLK1 (AUDIO_MCLK1)")
  expect(netlist).toContain(
    "- pin14(I2S_BCLK1, AUDIO_MCLK1): NETS(U1_I2S_BCLK1)",
  )
})
