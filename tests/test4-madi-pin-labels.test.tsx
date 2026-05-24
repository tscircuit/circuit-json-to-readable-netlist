import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

declare module "bun:test" {
  interface Matchers<T = unknown> {
    toMatchInlineSnapshot(snapshot?: string | null): Promise<MatcherResult>
  }
}

it("keeps MADI audio labels with channel numbers", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="qfn32"
        manufacturerPartNumber="MADI_AUDIO_BRIDGE"
        pinLabels={{
          pin1: ["GPIO12", "MADI1_RX"],
          pin2: ["GPIO13", "MADI1_TX"],
        }}
      />
      <chip
        name="J1"
        footprint="pinrow2"
        manufacturerPartNumber="MADI_PORT"
        pinLabels={{
          pin1: ["MADI1_RX"],
          pin2: ["MADI1_TX"],
        }}
      />
      <trace from=".U1 .MADI1_RX" to=".J1 .MADI1_RX" />
      <trace from=".U1 .MADI1_TX" to=".J1 .MADI1_TX" />
    </board>,
  )

  expect(
    convertCircuitJsonToReadableNetlist(circuitJson),
  ).toMatchInlineSnapshot(`
    "COMPONENTS:
     - U1: MADI_AUDIO_BRIDGE, qfn32
     - J1: MADI_PORT, pinrow2

    NET: U1_MADI1_RX
      - U1 GPIO12 (MADI1_RX)
      - J1 MADI1_RX

    NET: U1_MADI1_TX
      - U1 GPIO13 (MADI1_TX)
      - J1 MADI1_TX


    COMPONENT_PINS:
    U1 (MADI_AUDIO_BRIDGE)
    - pin1(GPIO12, MADI1_RX): NETS(U1_MADI1_RX)
    - pin2(GPIO13, MADI1_TX): NETS(U1_MADI1_TX)
    - pin3: NOT_CONNECTED
    - pin4: NOT_CONNECTED
    - pin5: NOT_CONNECTED
    - pin6: NOT_CONNECTED
    - pin7: NOT_CONNECTED
    - pin8: NOT_CONNECTED
    - pin9: NOT_CONNECTED
    - pin10: NOT_CONNECTED
    - pin11: NOT_CONNECTED
    - pin12: NOT_CONNECTED
    - pin13: NOT_CONNECTED
    - pin14: NOT_CONNECTED
    - pin15: NOT_CONNECTED
    - pin16: NOT_CONNECTED
    - pin17: NOT_CONNECTED
    - pin18: NOT_CONNECTED
    - pin19: NOT_CONNECTED
    - pin20: NOT_CONNECTED
    - pin21: NOT_CONNECTED
    - pin22: NOT_CONNECTED
    - pin23: NOT_CONNECTED
    - pin24: NOT_CONNECTED
    - pin25: NOT_CONNECTED
    - pin26: NOT_CONNECTED
    - pin27: NOT_CONNECTED
    - pin28: NOT_CONNECTED
    - pin29: NOT_CONNECTED
    - pin30: NOT_CONNECTED
    - pin31: NOT_CONNECTED
    - pin32: NOT_CONNECTED

    J1 (MADI_PORT)
    - pin1(MADI1_RX): NETS(U1_MADI1_RX)
    - pin2(MADI1_TX): NETS(U1_MADI1_TX)
    "
  `)
})
