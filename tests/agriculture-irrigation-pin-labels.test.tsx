import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

declare module "bun:test" {
  interface Matchers<T = unknown> {
    toMatchInlineSnapshot(snapshot?: string | null): Promise<MatcherResult>
  }
}

it("scores agriculture and irrigation sensor pin labels", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="qfn24"
        manufacturerPartNumber="AGRI-AFE"
        pinLabels={{
          pin14: ["LEAF_WET1"],
          pin15: ["SOIL_EC1"],
          pin16: ["RAIN_TIP1"],
        }}
      />
      <resistor resistance="10k" footprint="0402" name="R1" />
      <resistor resistance="20k" footprint="0402" name="R2" />
      <resistor resistance="30k" footprint="0402" name="R3" />

      <trace from=".U1 .LEAF_WET1" to=".R1 .pin1" />
      <trace from=".U1 .SOIL_EC1" to=".R2 .pin1" />
      <trace from=".U1 .RAIN_TIP1" to=".R3 .pin1" />
    </board>,
  )

  expect(
    convertCircuitJsonToReadableNetlist(circuitJson),
  ).toMatchInlineSnapshot(`
    "COMPONENTS:
     - U1: AGRI-AFE, qfn24
     - R1: 10kΩ 0402 resistor
     - R2: 20kΩ 0402 resistor
     - R3: 30kΩ 0402 resistor

    NET: U1_LEAF_WET1
      - U1 LEAF_WET1
      - R1 pin1

    NET: U1_SOIL_EC1
      - U1 SOIL_EC1
      - R2 pin1

    NET: U1_RAIN_TIP1
      - U1 RAIN_TIP1
      - R3 pin1


    COMPONENT_PINS:
    U1 (AGRI-AFE)
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
    - pin14(LEAF_WET1): NETS(U1_LEAF_WET1)
    - pin15(SOIL_EC1): NETS(U1_SOIL_EC1)
    - pin16(RAIN_TIP1): NETS(U1_RAIN_TIP1)
    - pin17: NOT_CONNECTED
    - pin18: NOT_CONNECTED
    - pin19: NOT_CONNECTED
    - pin20: NOT_CONNECTED
    - pin21: NOT_CONNECTED
    - pin22: NOT_CONNECTED
    - pin23: NOT_CONNECTED
    - pin24: NOT_CONNECTED

    R1 (10kΩ 0402)
    - pin1(anode, pos, left): NETS(U1_LEAF_WET1)
    - pin2(cathode, neg, right): NOT_CONNECTED

    R2 (20kΩ 0402)
    - pin1(anode, pos, left): NETS(U1_SOIL_EC1)
    - pin2(cathode, neg, right): NOT_CONNECTED

    R3 (30kΩ 0402)
    - pin1(anode, pos, left): NETS(U1_RAIN_TIP1)
    - pin2(cathode, neg, right): NOT_CONNECTED
    "
  `)
})
