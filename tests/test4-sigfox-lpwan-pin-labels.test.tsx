import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

declare module "bun:test" {
  interface Matchers<T = unknown> {
    toMatchInlineSnapshot(snapshot?: string | null): Promise<MatcherResult>
  }
}

it("preserves Sigfox and LPWAN radio pin labels in readable netlists", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="qfn24"
        manufacturerPartNumber="SIGFOX-MODEM"
        pinLabels={{
          pin14: ["SIGFOX_WAKE1"],
          pin15: ["LPWAN_TX1"],
        }}
      />
      <resistor resistance="10k" footprint="0402" name="R1" />
      <resistor resistance="22k" footprint="0402" name="R2" />

      <trace from=".U1 .SIGFOX_WAKE1" to=".R1 > .pin1" />
      <trace from=".U1 .LPWAN_TX1" to=".R2 > .pin1" />
    </board>,
  )

  expect(
    convertCircuitJsonToReadableNetlist(circuitJson),
  ).toMatchInlineSnapshot(`
    "COMPONENTS:
     - U1: SIGFOX-MODEM, qfn24
     - R1: 10kΩ 0402 resistor
     - R2: 22kΩ 0402 resistor

    NET: U1_SIGFOX_WAKE1
      - U1 SIGFOX_WAKE1
      - R1 pin1

    NET: U1_LPWAN_TX1
      - U1 LPWAN_TX1
      - R2 pin1


    COMPONENT_PINS:
    U1 (SIGFOX-MODEM)
    - pin1: NOT_CONNECTED
    - pin2: NOT_CONNECTED
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
    - pin14(SIGFOX_WAKE1): NETS(U1_SIGFOX_WAKE1)
    - pin15(LPWAN_TX1): NETS(U1_LPWAN_TX1)
    - pin16: NOT_CONNECTED
    - pin17: NOT_CONNECTED
    - pin18: NOT_CONNECTED
    - pin19: NOT_CONNECTED
    - pin20: NOT_CONNECTED
    - pin21: NOT_CONNECTED
    - pin22: NOT_CONNECTED
    - pin23: NOT_CONNECTED
    - pin24: NOT_CONNECTED

    R1 (10kΩ 0402)
    - pin1(anode, pos, left): NETS(U1_SIGFOX_WAKE1)
    - pin2(cathode, neg, right): NOT_CONNECTED

    R2 (22kΩ 0402)
    - pin1(anode, pos, left): NETS(U1_LPWAN_TX1)
    - pin2(cathode, neg, right): NOT_CONNECTED
    "
  `)
})
