import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

declare module "bun:test" {
  interface Matchers<T = unknown> {
    toMatchInlineSnapshot(snapshot?: string | null): Promise<MatcherResult>
  }
}

it("scores DSI3 and AK2H automotive sensor pin labels before digit fallback", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="soic8"
        manufacturerPartNumber="AUTOMOTIVE-SENSOR-IF"
        pinLabels={{
          pin1: ["DSI3_DATA1"],
          pin2: ["DSI3_SYNC1"],
          pin3: ["AK2H_TX1"],
          pin4: ["AK2H_RX1"],
          pin5: ["VDD"],
          pin6: ["GND"],
          pin7: ["GPIO1"],
          pin8: ["GPIO2"],
        }}
      />
      <resistor resistance="10k" footprint="0402" name="R1" />
      <resistor resistance="10k" footprint="0402" name="R2" />
      <capacitor capacitance="100nF" footprint="0402" name="C1" />
      <capacitor capacitance="100nF" footprint="0402" name="C2" />

      <trace from=".U1 .DSI3_DATA1" to=".R1 .pin1" />
      <trace from=".U1 .DSI3_SYNC1" to=".R2 .pin1" />
      <trace from=".U1 .AK2H_TX1" to=".C1 .pin1" />
      <trace from=".U1 .AK2H_RX1" to=".C2 .pin1" />
    </board>,
  )

  expect(
    convertCircuitJsonToReadableNetlist(circuitJson),
  ).toMatchInlineSnapshot(`
    "COMPONENTS:
     - U1: AUTOMOTIVE-SENSOR-IF, soic8
     - R1: 10kΩ 0402 resistor
     - R2: 10kΩ 0402 resistor
     - C1: 100nF 0402 capacitor
     - C2: 100nF 0402 capacitor

    NET: U1_DSI3_DATA1
      - U1 DSI3_DATA1
      - R1 pin1

    NET: U1_DSI3_SYNC1
      - U1 DSI3_SYNC1
      - R2 pin1

    NET: U1_AK2H_TX1
      - U1 AK2H_TX1
      - C1 pin1 (+)

    NET: U1_AK2H_RX1
      - U1 AK2H_RX1
      - C2 pin1 (+)


    COMPONENT_PINS:
    U1 (AUTOMOTIVE-SENSOR-IF)
    - pin1(DSI3_DATA1): NETS(U1_DSI3_DATA1)
    - pin2(DSI3_SYNC1): NETS(U1_DSI3_SYNC1)
    - pin3(AK2H_TX1): NETS(U1_AK2H_TX1)
    - pin4(AK2H_RX1): NETS(U1_AK2H_RX1)
    - pin5(VDD): NOT_CONNECTED
    - pin6(GND): NOT_CONNECTED
    - pin7(GPIO1): NOT_CONNECTED
    - pin8(GPIO2): NOT_CONNECTED

    R1 (10kΩ 0402)
    - pin1(anode, pos, left): NETS(U1_DSI3_DATA1)
    - pin2(cathode, neg, right): NOT_CONNECTED

    R2 (10kΩ 0402)
    - pin1(anode, pos, left): NETS(U1_DSI3_SYNC1)
    - pin2(cathode, neg, right): NOT_CONNECTED

    C1 (100nF 0402)
    - pin1(pos, anode, left): NETS(U1_AK2H_TX1)
    - pin2(neg, cathode, right): NOT_CONNECTED

    C2 (100nF 0402)
    - pin1(pos, anode, left): NETS(U1_AK2H_RX1)
    - pin2(neg, cathode, right): NOT_CONNECTED
    "
  `)
})
