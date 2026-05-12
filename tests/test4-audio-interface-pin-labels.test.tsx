import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

declare module "bun:test" {
  interface Matchers<T = unknown> {
    toMatchInlineSnapshot(snapshot?: string | null): Promise<MatcherResult>
  }
}

it("test4 audio interface pin labels", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="soic8"
        manufacturerPartNumber="AUDIOCODEC"
        pinLabels={{
          pin1: ["GND"],
          pin2: ["VDD"],
          pin3: ["I2S_BCLK"],
          pin4: ["I2S_LRCLK"],
          pin5: ["I2S_SDOUT"],
          pin6: ["I2S_SDIN"],
          pin7: ["PDM_CLK"],
          pin8: ["PDM_DAT"],
        }}
      />
      <resistor resistance="1k" footprint="0402" name="R1" />

      <trace from=".U1 .I2S_BCLK" to=".R1 > .pin1" />
    </board>,
  )

  expect(
    convertCircuitJsonToReadableNetlist(circuitJson),
  ).toMatchInlineSnapshot(`
    "COMPONENTS:
     - U1: AUDIOCODEC, soic8
     - R1: 1kΩ 0402 resistor

    NET: U1_I2S_BCLK
      - U1 I2S_BCLK
      - R1 pin1


    COMPONENT_PINS:
    U1 (AUDIOCODEC)
    - pin1(GND): NOT_CONNECTED
    - pin2(VDD): NOT_CONNECTED
    - pin3(I2S_BCLK): NETS(U1_I2S_BCLK)
    - pin4(I2S_LRCLK): NOT_CONNECTED
    - pin5(I2S_SDOUT): NOT_CONNECTED
    - pin6(I2S_SDIN): NOT_CONNECTED
    - pin7(PDM_CLK): NOT_CONNECTED
    - pin8(PDM_DAT): NOT_CONNECTED

    R1 (1kΩ 0402)
    - pin1(anode, pos, left): NETS(U1_I2S_BCLK)
    - pin2(cathode, neg, right): NOT_CONNECTED
    "
  `)
})
