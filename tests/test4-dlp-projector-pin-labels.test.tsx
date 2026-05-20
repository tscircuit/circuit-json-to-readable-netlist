import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

declare module "bun:test" {
  interface Matchers<T = unknown> {
    toMatchInlineSnapshot(snapshot?: string | null): Promise<MatcherResult>
  }
}

it("scores DLP projector pin labels before digit fallback", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="soic8"
        manufacturerPartNumber="DLP-CONTROLLER"
        pinLabels={{
          pin1: ["DMD_DCLK1"],
          pin2: ["DMD_LOADB1"],
          pin3: ["DLPC1_GPIO0"],
          pin4: ["LED_SEL0"],
          pin5: ["CMP_PWM0"],
          pin6: ["PARKZ"],
          pin7: ["SDA"],
          pin8: ["VDD"],
        }}
      />
      <resistor resistance="33" footprint="0402" name="R1" />
      <resistor resistance="33" footprint="0402" name="R2" />
      <resistor resistance="10k" footprint="0402" name="R3" />
      <capacitor capacitance="100nF" footprint="0402" name="C1" />

      <trace from=".U1 .DMD_DCLK1" to=".R1 .pin1" />
      <trace from=".U1 .DMD_LOADB1" to=".R2 .pin1" />
      <trace from=".U1 .LED_SEL0" to=".R3 .pin1" />
      <trace from=".U1 .CMP_PWM0" to=".C1 .pin1" />
    </board>,
  )

  expect(
    convertCircuitJsonToReadableNetlist(circuitJson),
  ).toMatchInlineSnapshot(`
    "COMPONENTS:
     - U1: DLP-CONTROLLER, soic8
     - R1: 33Ω 0402 resistor
     - R2: 33Ω 0402 resistor
     - R3: 10kΩ 0402 resistor
     - C1: 100nF 0402 capacitor

    NET: U1_DMD_DCLK1
      - U1 DMD_DCLK1
      - R1 pin1

    NET: U1_DMD_LOADB1
      - U1 DMD_LOADB1
      - R2 pin1

    NET: U1_LED_SEL0
      - U1 LED_SEL0
      - R3 pin1

    NET: U1_CMP_PWM0
      - U1 CMP_PWM0
      - C1 pin1 (+)


    COMPONENT_PINS:
    U1 (DLP-CONTROLLER)
    - pin1(DMD_DCLK1): NETS(U1_DMD_DCLK1)
    - pin2(DMD_LOADB1): NETS(U1_DMD_LOADB1)
    - pin3(DLPC1_GPIO0): NOT_CONNECTED
    - pin4(LED_SEL0): NETS(U1_LED_SEL0)
    - pin5(CMP_PWM0): NETS(U1_CMP_PWM0)
    - pin6(PARKZ): NOT_CONNECTED
    - pin7(SDA): NOT_CONNECTED
    - pin8(VDD): NOT_CONNECTED

    R1 (33Ω 0402)
    - pin1(anode, pos, left): NETS(U1_DMD_DCLK1)
    - pin2(cathode, neg, right): NOT_CONNECTED

    R2 (33Ω 0402)
    - pin1(anode, pos, left): NETS(U1_DMD_LOADB1)
    - pin2(cathode, neg, right): NOT_CONNECTED

    R3 (10kΩ 0402)
    - pin1(anode, pos, left): NETS(U1_LED_SEL0)
    - pin2(cathode, neg, right): NOT_CONNECTED

    C1 (100nF 0402)
    - pin1(pos, anode, left): NETS(U1_CMP_PWM0)
    - pin2(neg, cathode, right): NOT_CONNECTED
    "
  `)
})
