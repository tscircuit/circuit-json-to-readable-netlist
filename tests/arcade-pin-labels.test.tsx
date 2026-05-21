import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { scorePhrase } from "lib/scorePhrase"
import { renderCircuit } from "tests/fixtures/render-circuit"

declare module "bun:test" {
  interface Matchers<T = unknown> {
    toMatchInlineSnapshot(snapshot?: string | null): Promise<MatcherResult>
  }
}

it("scores arcade cabinet labels before the numeric fallback", () => {
  expect(scorePhrase("JAMMA_COIN1")).toBeGreaterThan(scorePhrase("pos"))
  expect(scorePhrase("JVS_TX1")).toBeGreaterThan(scorePhrase("neg"))
})

it("uses JAMMA and JVS labels for readable net names", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="soic8"
        manufacturerPartNumber="JVS-IO"
        pinLabels={{
          pin1: ["pin1", "JAMMA_COIN1"],
          pin2: ["JVS_TX1"],
        }}
      />
      <resistor resistance="1k" footprint="0402" name="R1" />
      <trace from=".U1 .JAMMA_COIN1" to=".R1 .pin1" />
      <trace from=".U1 .JVS_TX1" to=".R1 .pin2" />
    </board>,
  )

  expect(
    convertCircuitJsonToReadableNetlist(circuitJson),
  ).toMatchInlineSnapshot(`
    "COMPONENTS:
     - U1: JVS-IO, soic8
     - R1: 1kΩ 0402 resistor

    NET: U1_JAMMA_COIN1
      - U1 pin1 (JAMMA_COIN1)
      - R1 pin1

    NET: U1_JVS_TX1
      - U1 JVS_TX1
      - R1 pin2


    COMPONENT_PINS:
    U1 (JVS-IO)
    - pin1(JAMMA_COIN1): NETS(U1_JAMMA_COIN1)
    - pin2(JVS_TX1): NETS(U1_JVS_TX1)
    - pin3: NOT_CONNECTED
    - pin4: NOT_CONNECTED
    - pin5: NOT_CONNECTED
    - pin6: NOT_CONNECTED
    - pin7: NOT_CONNECTED
    - pin8: NOT_CONNECTED

    R1 (1kΩ 0402)
    - pin1(anode, pos, left): NETS(U1_JAMMA_COIN1)
    - pin2(cathode, neg, right): NETS(U1_JVS_TX1)
    "
  `)
})
