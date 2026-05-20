import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

declare module "bun:test" {
  interface Matchers<T = unknown> {
    toMatchInlineSnapshot(snapshot?: string | null): Promise<MatcherResult>
  }
}

it("scores audio codec clock and serial data pin labels before digit fallback", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="soic8"
        manufacturerPartNumber="AUDIO-CODEC"
        pinLabels={{
          pin1: ["BCLK1"],
          pin2: ["LRCLK1"],
          pin3: ["MCLK1"],
          pin4: ["SDOUT1"],
          pin5: ["SDIN1"],
          pin6: ["FSYNC1"],
          pin7: ["DACDAT1"],
          pin8: ["ADCDAT1"],
        }}
      />
      <resistor resistance="33" footprint="0402" name="R1" />
      <resistor resistance="33" footprint="0402" name="R2" />
      <resistor resistance="33" footprint="0402" name="R3" />
      <resistor resistance="33" footprint="0402" name="R4" />

      <trace from=".U1 .BCLK1" to=".R1 .pin1" />
      <trace from=".U1 .LRCLK1" to=".R2 .pin1" />
      <trace from=".U1 .MCLK1" to=".R3 .pin1" />
      <trace from=".U1 .SDOUT1" to=".R4 .pin1" />
    </board>,
  )

  expect(
    convertCircuitJsonToReadableNetlist(circuitJson),
  ).toMatchInlineSnapshot(`
    "COMPONENTS:
     - U1: AUDIO-CODEC, soic8
     - R1: 33Ω 0402 resistor
     - R2: 33Ω 0402 resistor
     - R3: 33Ω 0402 resistor
     - R4: 33Ω 0402 resistor

    NET: U1_BCLK1
      - U1 BCLK1
      - R1 pin1

    NET: U1_LRCLK1
      - U1 LRCLK1
      - R2 pin1

    NET: U1_MCLK1
      - U1 MCLK1
      - R3 pin1

    NET: U1_SDOUT1
      - U1 SDOUT1
      - R4 pin1


    COMPONENT_PINS:
    U1 (AUDIO-CODEC)
    - pin1(BCLK1): NETS(U1_BCLK1)
    - pin2(LRCLK1): NETS(U1_LRCLK1)
    - pin3(MCLK1): NETS(U1_MCLK1)
    - pin4(SDOUT1): NETS(U1_SDOUT1)
    - pin5(SDIN1): NOT_CONNECTED
    - pin6(FSYNC1): NOT_CONNECTED
    - pin7(DACDAT1): NOT_CONNECTED
    - pin8(ADCDAT1): NOT_CONNECTED

    R1 (33Ω 0402)
    - pin1(anode, pos, left): NETS(U1_BCLK1)
    - pin2(cathode, neg, right): NOT_CONNECTED

    R2 (33Ω 0402)
    - pin1(anode, pos, left): NETS(U1_LRCLK1)
    - pin2(cathode, neg, right): NOT_CONNECTED

    R3 (33Ω 0402)
    - pin1(anode, pos, left): NETS(U1_MCLK1)
    - pin2(cathode, neg, right): NOT_CONNECTED

    R4 (33Ω 0402)
    - pin1(anode, pos, left): NETS(U1_SDOUT1)
    - pin2(cathode, neg, right): NOT_CONNECTED
    "
  `)
})
