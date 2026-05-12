import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { scorePhrase } from "lib/scorePhrase"
import { renderCircuit } from "tests/fixtures/render-circuit"

it("scores SoundWire and SLIMbus audio aliases above passive labels", () => {
  expect(scorePhrase("SOUNDWIRE_SD0")).toBeGreaterThan(scorePhrase("pos"))
  expect(scorePhrase("SLIMBUS_DATA1")).toBeGreaterThan(scorePhrase("pos"))
  expect(scorePhrase("TDM_DOUT1")).toBeGreaterThan(scorePhrase("pos"))
})

it("preserves SoundWire and SLIMbus labels in readable netlists", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="qfn32"
        manufacturerPartNumber="AUDIO-CODEC"
        pinLabels={{
          pin1: ["SOUNDWIRE_SD0"],
          pin2: ["SLIMBUS_DATA1"],
        }}
      />
      <resistor resistance="10k" footprint="0402" name="R1" />
      <resistor resistance="10k" footprint="0402" name="R2" />

      <trace from=".U1 .SOUNDWIRE_SD0" to=".R1 > .pin1" />
      <trace from=".U1 .SLIMBUS_DATA1" to=".R2 > .pin1" />
    </board>,
  )

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_SOUNDWIRE_SD0")
  expect(netlist).toContain("  - U1 SOUNDWIRE_SD0")
  expect(netlist).toContain("- pin1(SOUNDWIRE_SD0): NETS(U1_SOUNDWIRE_SD0)")
  expect(netlist).toContain("NET: U1_SLIMBUS_DATA1")
  expect(netlist).toContain("  - U1 SLIMBUS_DATA1")
  expect(netlist).toContain("- pin2(SLIMBUS_DATA1): NETS(U1_SLIMBUS_DATA1)")
})
