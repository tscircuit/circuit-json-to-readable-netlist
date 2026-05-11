import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

declare module "bun:test" {
  interface Matchers<T = unknown> {
    toMatchInlineSnapshot(snapshot?: string | null): Promise<MatcherResult>
  }
}

it("preserves I2S audio bus pin labels in readable netlists", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="soic8"
        manufacturerPartNumber="PCM5102A"
        pinLabels={{
          pin1: ["GPIO1", "I2S_BCLK"],
          pin2: ["GPIO2", "I2S_LRCLK"],
          pin3: ["GPIO3", "SDOUT"],
        }}
      />
      <resistor resistance="33Ω" name="R1" />
      <resistor resistance="33Ω" name="R2" />
      <resistor resistance="33Ω" name="R3" />

      <trace from=".U1 .GPIO1" to=".R1 > .pin1" />
      <trace from=".U1 .GPIO2" to=".R2 > .pin1" />
      <trace from=".U1 .GPIO3" to=".R3 > .pin1" />
    </board>,
  )

  expect(
    convertCircuitJsonToReadableNetlist(circuitJson),
  ).toMatchInlineSnapshot(`
    "COMPONENTS:
     - U1: PCM5102A, soic8
     - R1: 33Ω resistor
     - R2: 33Ω resistor
     - R3: 33Ω resistor

    NET: U1_I2S_BCLK
      - U1 GPIO1 (I2S_BCLK)
      - R1 pin1

    NET: U1_I2S_LRCLK
      - U1 GPIO2 (I2S_LRCLK)
      - R2 pin1

    NET: U1_SDOUT
      - U1 GPIO3 (SDOUT)
      - R3 pin1


    COMPONENT_PINS:
    U1 (PCM5102A)
    - pin1(GPIO1, I2S_BCLK): NETS(U1_I2S_BCLK)
    - pin2(GPIO2, I2S_LRCLK): NETS(U1_I2S_LRCLK)
    - pin3(GPIO3, SDOUT): NETS(U1_SDOUT)
    - pin4: NOT_CONNECTED
    - pin5: NOT_CONNECTED
    - pin6: NOT_CONNECTED
    - pin7: NOT_CONNECTED
    - pin8: NOT_CONNECTED

    R1 (33Ω undefined)
    - pin1(anode, pos, left): NETS(U1_I2S_BCLK)
    - pin2(cathode, neg, right): NOT_CONNECTED

    R2 (33Ω undefined)
    - pin1(anode, pos, left): NETS(U1_I2S_LRCLK)
    - pin2(cathode, neg, right): NOT_CONNECTED

    R3 (33Ω undefined)
    - pin1(anode, pos, left): NETS(U1_SDOUT)
    - pin2(cathode, neg, right): NOT_CONNECTED
    "
  `)
})
