import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

declare module "bun:test" {
  interface Matchers<T = unknown> {
    toMatchInlineSnapshot(snapshot?: string | null): Promise<MatcherResult>
  }
}

it("preserves motor-control pin aliases in generated net names", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="soic8"
        manufacturerPartNumber="MOTOR_DRV"
        pinLabels={{
          pin1: ["pin14", "PWM1"],
          pin2: ["pin15", "HALL1"],
        }}
      />
      <resistor resistance="1k" footprint="0402" name="R1" />

      <trace from=".U1 .PWM1" to=".R1 > .pin1" />
      <trace from=".U1 .HALL1" to=".R1 > .pin2" />
    </board>,
  )

  expect(
    convertCircuitJsonToReadableNetlist(circuitJson),
  ).toMatchInlineSnapshot(`
    "COMPONENTS:
     - U1: MOTOR_DRV, soic8
     - R1: 1kΩ 0402 resistor

    NET: U1_PWM1
      - U1 pin14 (PWM1)
      - R1 pin1

    NET: U1_HALL1
      - U1 pin15 (HALL1)
      - R1 pin2


    COMPONENT_PINS:
    U1 (MOTOR_DRV)
    - pin1(pin14, PWM1): NETS(U1_PWM1)
    - pin2(pin15, HALL1): NETS(U1_HALL1)
    - pin3: NOT_CONNECTED
    - pin4: NOT_CONNECTED
    - pin5: NOT_CONNECTED
    - pin6: NOT_CONNECTED
    - pin7: NOT_CONNECTED
    - pin8: NOT_CONNECTED

    R1 (1kΩ 0402)
    - pin1(anode, pos, left): NETS(U1_PWM1)
    - pin2(cathode, neg, right): NETS(U1_HALL1)
    "
  `)
})
