import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

declare module "bun:test" {
  interface Matchers<T = unknown> {
    toMatchInlineSnapshot(snapshot?: string | null): Promise<MatcherResult>
  }
}

it("scores FireWire and IEEE-1394 pin aliases", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="qfn16"
        manufacturerPartNumber="TSB41AB2"
        pinLabels={{
          pin1: ["TPA1_P"],
          pin2: ["TPA1_N"],
          pin3: ["TPB1_P"],
          pin4: ["CABLE_POWER1"],
        }}
      />
      <capacitor capacitance="1nF" footprint="0402" name="C1" />
      <capacitor capacitance="1nF" footprint="0402" name="C2" />
      <capacitor capacitance="1nF" footprint="0402" name="C3" />

      <trace from=".U1 .TPA1_P" to=".C1 .pin1" />
      <trace from=".U1 .TPB1_P" to=".C2 .pin1" />
      <trace from=".U1 .CABLE_POWER1" to=".C3 .pin1" />
    </board>,
  )

  expect(
    convertCircuitJsonToReadableNetlist(circuitJson),
  ).toMatchInlineSnapshot(`
    "COMPONENTS:
     - U1: TSB41AB2, qfn16
     - C1: 1nF 0402 capacitor
     - C2: 1nF 0402 capacitor
     - C3: 1nF 0402 capacitor

    NET: U1_TPA1_P
      - U1 TPA1_P
      - C1 pin1 (+)

    NET: U1_TPB1_P
      - U1 TPB1_P
      - C2 pin1 (+)

    NET: U1_CABLE_POWER1
      - U1 CABLE_POWER1
      - C3 pin1 (+)


    COMPONENT_PINS:
    U1 (TSB41AB2)
    - pin1(TPA1_P): NETS(U1_TPA1_P)
    - pin2(TPA1_N): NOT_CONNECTED
    - pin3(TPB1_P): NETS(U1_TPB1_P)
    - pin4(CABLE_POWER1): NETS(U1_CABLE_POWER1)
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

    C1 (1nF 0402)
    - pin1(pos, anode, left): NETS(U1_TPA1_P)
    - pin2(neg, cathode, right): NOT_CONNECTED

    C2 (1nF 0402)
    - pin1(pos, anode, left): NETS(U1_TPB1_P)
    - pin2(neg, cathode, right): NOT_CONNECTED

    C3 (1nF 0402)
    - pin1(pos, anode, left): NETS(U1_CABLE_POWER1)
    - pin2(neg, cathode, right): NOT_CONNECTED
    "
  `)
})
