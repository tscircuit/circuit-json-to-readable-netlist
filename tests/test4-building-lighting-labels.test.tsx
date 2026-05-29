import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

declare module "bun:test" {
  interface Matchers<T = unknown> {
    toMatchInlineSnapshot(snapshot?: string | null): Promise<MatcherResult>
  }
}

it("preserves building lighting control labels with digits", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="CTRL1"
        footprint="soic8"
        manufacturerPartNumber="LIGHTCTRL"
        pinLabels={{
          pin1: ["DALI2", "pos"],
          pin2: ["DMX512_OUT1", "pos"],
          pin3: ["KNX_TP1", "pos"],
          pin4: ["DIM_0_10V1", "pos"],
        }}
      />
      <resistor resistance="1k" footprint="0402" name="R1" />
      <resistor resistance="1k" footprint="0402" name="R2" />
      <resistor resistance="1k" footprint="0402" name="R3" />
      <resistor resistance="1k" footprint="0402" name="R4" />

      <trace from=".CTRL1 .DALI2" to=".R1 > .pin1" />
      <trace from=".CTRL1 .DMX512_OUT1" to=".R2 > .pin1" />
      <trace from=".CTRL1 .KNX_TP1" to=".R3 > .pin1" />
      <trace from=".CTRL1 .DIM_0_10V1" to=".R4 > .pin1" />
    </board>,
  )

  expect(
    convertCircuitJsonToReadableNetlist(circuitJson),
  ).toMatchInlineSnapshot(`
    "COMPONENTS:
     - CTRL1: LIGHTCTRL, soic8
     - R1: 1kΩ 0402 resistor
     - R2: 1kΩ 0402 resistor
     - R3: 1kΩ 0402 resistor
     - R4: 1kΩ 0402 resistor

    NET: CTRL1_DALI2
      - CTRL1 DALI2 (+)
      - R1 pin1

    NET: CTRL1_DMX512_OUT1
      - CTRL1 DMX512_OUT1 (+)
      - R2 pin1

    NET: CTRL1_KNX_TP1
      - CTRL1 KNX_TP1 (+)
      - R3 pin1

    NET: CTRL1_DIM_0_10V1
      - CTRL1 DIM_0_10V1 (+)
      - R4 pin1


    COMPONENT_PINS:
    CTRL1 (LIGHTCTRL)
    - pin1(DALI2, pos): NETS(CTRL1_DALI2)
    - pin2(DMX512_OUT1, pos): NETS(CTRL1_DMX512_OUT1)
    - pin3(KNX_TP1, pos): NETS(CTRL1_KNX_TP1)
    - pin4(DIM_0_10V1, pos): NETS(CTRL1_DIM_0_10V1)
    - pin5: NOT_CONNECTED
    - pin6: NOT_CONNECTED
    - pin7: NOT_CONNECTED
    - pin8: NOT_CONNECTED

    R1 (1kΩ 0402)
    - pin1(anode, pos, left): NETS(CTRL1_DALI2)
    - pin2(cathode, neg, right): NOT_CONNECTED

    R2 (1kΩ 0402)
    - pin1(anode, pos, left): NETS(CTRL1_DMX512_OUT1)
    - pin2(cathode, neg, right): NOT_CONNECTED

    R3 (1kΩ 0402)
    - pin1(anode, pos, left): NETS(CTRL1_KNX_TP1)
    - pin2(cathode, neg, right): NOT_CONNECTED

    R4 (1kΩ 0402)
    - pin1(anode, pos, left): NETS(CTRL1_DIM_0_10V1)
    - pin2(cathode, neg, right): NOT_CONNECTED
    "
  `)
})
