import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

declare module "bun:test" {
  interface Matchers<T = unknown> {
    toMatchInlineSnapshot(snapshot?: string | null): Promise<MatcherResult>
  }
}

it("scores pump controller pin labels before digit fallback", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="soic8"
        manufacturerPartNumber="PUMP-CONTROLLER"
        pinLabels={{
          pin1: ["PUMP_PWM1"],
          pin2: ["PUMP_TACH1"],
          pin3: ["PUMP_FAULT1"],
          pin4: ["FLOW_PULSE1"],
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

      <trace from=".U1 .PUMP_PWM1" to=".R1 .pin1" />
      <trace from=".U1 .PUMP_TACH1" to=".R2 .pin1" />
      <trace from=".U1 .PUMP_FAULT1" to=".C1 .pin1" />
      <trace from=".U1 .FLOW_PULSE1" to=".C2 .pin1" />
    </board>,
  )

  expect(
    convertCircuitJsonToReadableNetlist(circuitJson),
  ).toMatchInlineSnapshot(`
    "COMPONENTS:
     - U1: PUMP-CONTROLLER, soic8
     - R1: 10kΩ 0402 resistor
     - R2: 10kΩ 0402 resistor
     - C1: 100nF 0402 capacitor
     - C2: 100nF 0402 capacitor

    NET: U1_PUMP_PWM1
      - U1 PUMP_PWM1
      - R1 pin1

    NET: U1_PUMP_TACH1
      - U1 PUMP_TACH1
      - R2 pin1

    NET: U1_PUMP_FAULT1
      - U1 PUMP_FAULT1
      - C1 pin1 (+)

    NET: U1_FLOW_PULSE1
      - U1 FLOW_PULSE1
      - C2 pin1 (+)


    COMPONENT_PINS:
    U1 (PUMP-CONTROLLER)
    - pin1(PUMP_PWM1): NETS(U1_PUMP_PWM1)
    - pin2(PUMP_TACH1): NETS(U1_PUMP_TACH1)
    - pin3(PUMP_FAULT1): NETS(U1_PUMP_FAULT1)
    - pin4(FLOW_PULSE1): NETS(U1_FLOW_PULSE1)
    - pin5(VDD): NOT_CONNECTED
    - pin6(GND): NOT_CONNECTED
    - pin7(GPIO1): NOT_CONNECTED
    - pin8(GPIO2): NOT_CONNECTED

    R1 (10kΩ 0402)
    - pin1(anode, pos, left): NETS(U1_PUMP_PWM1)
    - pin2(cathode, neg, right): NOT_CONNECTED

    R2 (10kΩ 0402)
    - pin1(anode, pos, left): NETS(U1_PUMP_TACH1)
    - pin2(cathode, neg, right): NOT_CONNECTED

    C1 (100nF 0402)
    - pin1(pos, anode, left): NETS(U1_PUMP_FAULT1)
    - pin2(neg, cathode, right): NOT_CONNECTED

    C2 (100nF 0402)
    - pin1(pos, anode, left): NETS(U1_FLOW_PULSE1)
    - pin2(neg, cathode, right): NOT_CONNECTED
    "
  `)
})
