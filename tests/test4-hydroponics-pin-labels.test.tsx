import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

declare module "bun:test" {
  interface Matchers<T = unknown> {
    toMatchInlineSnapshot(snapshot?: string | null): Promise<MatcherResult>
  }
}

it("preserves digit-bearing hydroponics pin labels", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="soic8"
        manufacturerPartNumber="GROW_CTRL"
        pinLabels={{
          pin1: ["GPIO1", "NUTRIENT_PUMP1"],
          pin2: ["GPIO2", "PH_SENSOR1"],
          pin3: ["GPIO3", "EC_SENSOR1"],
          pin4: ["GPIO4", "WATER_LEVEL1"],
          pin5: ["GPIO5", "DOSER_EN1"],
          pin6: ["GPIO6"],
          pin7: ["GPIO7"],
          pin8: ["VDD"],
        }}
      />
      <resistor resistance="1k" footprint="0402" name="R1" />

      <trace from=".U1 .GPIO1" to=".R1 .pin1" />
    </board>,
  )

  expect(
    convertCircuitJsonToReadableNetlist(circuitJson),
  ).toMatchInlineSnapshot(`
    "COMPONENTS:
     - U1: GROW_CTRL, soic8
     - R1: 1kΩ 0402 resistor

    NET: U1_NUTRIENT_PUMP1
      - U1 GPIO1 (NUTRIENT_PUMP1)
      - R1 pin1


    COMPONENT_PINS:
    U1 (GROW_CTRL)
    - pin1(GPIO1, NUTRIENT_PUMP1): NETS(U1_NUTRIENT_PUMP1)
    - pin2(GPIO2, PH_SENSOR1): NOT_CONNECTED
    - pin3(GPIO3, EC_SENSOR1): NOT_CONNECTED
    - pin4(GPIO4, WATER_LEVEL1): NOT_CONNECTED
    - pin5(GPIO5, DOSER_EN1): NOT_CONNECTED
    - pin6(GPIO6): NOT_CONNECTED
    - pin7(GPIO7): NOT_CONNECTED
    - pin8(VDD): NOT_CONNECTED

    R1 (1kΩ 0402)
    - pin1(anode, pos, left): NETS(U1_NUTRIENT_PUMP1)
    - pin2(cathode, neg, right): NOT_CONNECTED
    "
  `)
})