import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

declare module "bun:test" {
  interface Matchers<T = unknown> {
    toMatchInlineSnapshot(snapshot?: string | null): Promise<MatcherResult>
  }
}

it("scores ATX and EPS power connector pin aliases", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="J1"
        footprint="pinrow10"
        manufacturerPartNumber="ATX_POWER_CONNECTOR"
        pinLabels={{
          pin1: ["ATX_PWR_OK1"],
          pin2: ["EPS12V_SENSE1"],
          pin3: ["MOLEX_5V1"],
        }}
      />
      <capacitor capacitance="1nF" footprint="0402" name="C1" />
      <capacitor capacitance="1nF" footprint="0402" name="C2" />
      <capacitor capacitance="1nF" footprint="0402" name="C3" />

      <trace from=".J1 .ATX_PWR_OK1" to=".C1 .pin1" />
      <trace from=".J1 .EPS12V_SENSE1" to=".C2 .pin1" />
      <trace from=".J1 .MOLEX_5V1" to=".C3 .pin1" />
    </board>,
  )

  expect(
    convertCircuitJsonToReadableNetlist(circuitJson),
  ).toMatchInlineSnapshot(`
    "COMPONENTS:
     - J1: ATX_POWER_CONNECTOR, pinrow10
     - C1: 1nF 0402 capacitor
     - C2: 1nF 0402 capacitor
     - C3: 1nF 0402 capacitor

    NET: J1_ATX_PWR_OK1
      - J1 ATX_PWR_OK1
      - C1 pin1 (+)

    NET: J1_EPS12V_SENSE1
      - J1 EPS12V_SENSE1
      - C2 pin1 (+)

    NET: J1_MOLEX_5V1
      - J1 MOLEX_5V1
      - C3 pin1 (+)


    COMPONENT_PINS:
    J1 (ATX_POWER_CONNECTOR)
    - pin1(ATX_PWR_OK1): NETS(J1_ATX_PWR_OK1)
    - pin2(EPS12V_SENSE1): NETS(J1_EPS12V_SENSE1)
    - pin3(MOLEX_5V1): NETS(J1_MOLEX_5V1)
    - pin4: NOT_CONNECTED
    - pin5: NOT_CONNECTED
    - pin6: NOT_CONNECTED
    - pin7: NOT_CONNECTED
    - pin8: NOT_CONNECTED
    - pin9: NOT_CONNECTED
    - pin10: NOT_CONNECTED

    C1 (1nF 0402)
    - pin1(pos, anode, left): NETS(J1_ATX_PWR_OK1)
    - pin2(neg, cathode, right): NOT_CONNECTED

    C2 (1nF 0402)
    - pin1(pos, anode, left): NETS(J1_EPS12V_SENSE1)
    - pin2(neg, cathode, right): NOT_CONNECTED

    C3 (1nF 0402)
    - pin1(pos, anode, left): NETS(J1_MOLEX_5V1)
    - pin2(neg, cathode, right): NOT_CONNECTED
    "
  `)
})
