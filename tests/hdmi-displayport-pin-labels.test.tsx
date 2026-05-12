import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

it("scores HDMI and DisplayPort pin aliases", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="J1"
        footprint="qfn16"
        manufacturerPartNumber="HDMI-DP"
        pinLabels={{
          pin1: ["TMDS_DATA2_P"],
          pin2: ["TMDS_CLK_N"],
          pin3: ["DP_AUXP0"],
          pin4: ["HPD1"],
          pin5: ["CEC1"],
        }}
      />
      <capacitor capacitance="1nF" footprint="0402" name="C1" />
      <capacitor capacitance="1nF" footprint="0402" name="C2" />
      <capacitor capacitance="1nF" footprint="0402" name="C3" />
      <capacitor capacitance="1nF" footprint="0402" name="C4" />
      <capacitor capacitance="1nF" footprint="0402" name="C5" />

      <trace from=".J1 .TMDS_DATA2_P" to=".C1 .pin1" />
      <trace from=".J1 .TMDS_CLK_N" to=".C2 .pin1" />
      <trace from=".J1 .DP_AUXP0" to=".C3 .pin1" />
      <trace from=".J1 .HPD1" to=".C4 .pin1" />
      <trace from=".J1 .CEC1" to=".C5 .pin1" />
    </board>,
  )

  const readableNetlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(readableNetlist).toContain("NET: J1_TMDS_DATA2_P")
  expect(readableNetlist).toContain("NET: J1_TMDS_CLK_N")
  expect(readableNetlist).toContain("NET: J1_DP_AUXP0")
  expect(readableNetlist).toContain("NET: J1_HPD1")
  expect(readableNetlist).toContain("NET: J1_CEC1")
})
