import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

declare module "bun:test" {
  interface Matchers<T = unknown> {
    toMatchInlineSnapshot(snapshot?: string | null): Promise<MatcherResult>
  }
}

it("scores OLED display bias pin labels before digit fallback", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="soic8"
        manufacturerPartNumber="OLED-BIAS-PMIC"
        pinLabels={{
          pin1: ["ELVDD1"],
          pin2: ["ELVSS1"],
          pin3: ["VCOM1"],
          pin4: ["VGH1"],
          pin5: ["VGL1"],
          pin6: ["IREF1"],
          pin7: ["SCL"],
          pin8: ["VDD"],
        }}
      />
      <capacitor capacitance="1uF" footprint="0402" name="C1" />
      <capacitor capacitance="1uF" footprint="0402" name="C2" />
      <resistor resistance="100k" footprint="0402" name="R1" />
      <resistor resistance="1M" footprint="0402" name="R2" />

      <trace from=".U1 .ELVDD1" to=".C1 .pin1" />
      <trace from=".U1 .ELVSS1" to=".C2 .pin1" />
      <trace from=".U1 .VCOM1" to=".R1 .pin1" />
      <trace from=".U1 .IREF1" to=".R2 .pin1" />
    </board>,
  )

  expect(
    convertCircuitJsonToReadableNetlist(circuitJson),
  ).toMatchInlineSnapshot(`
    "COMPONENTS:
     - U1: OLED-BIAS-PMIC, soic8
     - C1: 1µF 0402 capacitor
     - C2: 1µF 0402 capacitor
     - R1: 100kΩ 0402 resistor
     - R2: 1MΩ 0402 resistor

    NET: U1_ELVDD1
      - U1 ELVDD1
      - C1 pin1 (+)

    NET: U1_ELVSS1
      - U1 ELVSS1
      - C2 pin1 (+)

    NET: U1_VCOM1
      - U1 VCOM1
      - R1 pin1

    NET: U1_IREF1
      - U1 IREF1
      - R2 pin1


    COMPONENT_PINS:
    U1 (OLED-BIAS-PMIC)
    - pin1(ELVDD1): NETS(U1_ELVDD1)
    - pin2(ELVSS1): NETS(U1_ELVSS1)
    - pin3(VCOM1): NETS(U1_VCOM1)
    - pin4(VGH1): NOT_CONNECTED
    - pin5(VGL1): NOT_CONNECTED
    - pin6(IREF1): NETS(U1_IREF1)
    - pin7(SCL): NOT_CONNECTED
    - pin8(VDD): NOT_CONNECTED

    C1 (1µF 0402)
    - pin1(pos, anode, left): NETS(U1_ELVDD1)
    - pin2(neg, cathode, right): NOT_CONNECTED

    C2 (1µF 0402)
    - pin1(pos, anode, left): NETS(U1_ELVSS1)
    - pin2(neg, cathode, right): NOT_CONNECTED

    R1 (100kΩ 0402)
    - pin1(anode, pos, left): NETS(U1_VCOM1)
    - pin2(cathode, neg, right): NOT_CONNECTED

    R2 (1MΩ 0402)
    - pin1(anode, pos, left): NETS(U1_IREF1)
    - pin2(cathode, neg, right): NOT_CONNECTED
    "
  `)
})
