import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

declare module "bun:test" {
  interface Matchers<T = unknown> {
    toMatchInlineSnapshot(snapshot?: string | null): Promise<MatcherResult>
  }
}

it("scores DMX, DALI, and XLR lighting-control pin aliases", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="soic8"
        manufacturerPartNumber="LIGHTING_IF"
        pinLabels={{
          pin1: ["DMX512_A1"],
          pin2: ["DALI_BUS1"],
          pin3: ["XLR_HOT1"],
        }}
      />
      <capacitor capacitance="1nF" footprint="0402" name="C1" />
      <capacitor capacitance="1nF" footprint="0402" name="C2" />
      <capacitor capacitance="1nF" footprint="0402" name="C3" />

      <trace from=".U1 .DMX512_A1" to=".C1 .pin1" />
      <trace from=".U1 .DALI_BUS1" to=".C2 .pin1" />
      <trace from=".U1 .XLR_HOT1" to=".C3 .pin1" />
    </board>,
  )

  expect(
    convertCircuitJsonToReadableNetlist(circuitJson),
  ).toMatchInlineSnapshot(`
    "COMPONENTS:
     - U1: LIGHTING_IF, soic8
     - C1: 1nF 0402 capacitor
     - C2: 1nF 0402 capacitor
     - C3: 1nF 0402 capacitor

    NET: U1_DMX512_A1
      - U1 DMX512_A1
      - C1 pin1 (+)

    NET: U1_DALI_BUS1
      - U1 DALI_BUS1
      - C2 pin1 (+)

    NET: U1_XLR_HOT1
      - U1 XLR_HOT1
      - C3 pin1 (+)


    COMPONENT_PINS:
    U1 (LIGHTING_IF)
    - pin1(DMX512_A1): NETS(U1_DMX512_A1)
    - pin2(DALI_BUS1): NETS(U1_DALI_BUS1)
    - pin3(XLR_HOT1): NETS(U1_XLR_HOT1)
    - pin4: NOT_CONNECTED
    - pin5: NOT_CONNECTED
    - pin6: NOT_CONNECTED
    - pin7: NOT_CONNECTED
    - pin8: NOT_CONNECTED

    C1 (1nF 0402)
    - pin1(pos, anode, left): NETS(U1_DMX512_A1)
    - pin2(neg, cathode, right): NOT_CONNECTED

    C2 (1nF 0402)
    - pin1(pos, anode, left): NETS(U1_DALI_BUS1)
    - pin2(neg, cathode, right): NOT_CONNECTED

    C3 (1nF 0402)
    - pin1(pos, anode, left): NETS(U1_XLR_HOT1)
    - pin2(neg, cathode, right): NOT_CONNECTED
    "
  `)
})
