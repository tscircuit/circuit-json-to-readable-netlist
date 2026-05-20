import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

declare module "bun:test" {
  interface Matchers<T = unknown> {
    toMatchInlineSnapshot(snapshot?: string | null): Promise<MatcherResult>
  }
}

it("scores USB-C pin labels before digit fallback", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="J1"
        footprint="soic8"
        manufacturerPartNumber="USB-C-RECEPTACLE"
        pinLabels={{
          pin1: ["VBUS"],
          pin2: ["CC1"],
          pin3: ["CC2"],
          pin4: ["SBU1"],
          pin5: ["SBU2"],
          pin6: ["DP"],
          pin7: ["DN"],
          pin8: ["GND"],
        }}
      />
      <resistor resistance="5.1k" footprint="0402" name="R1" />
      <resistor resistance="5.1k" footprint="0402" name="R2" />
      <capacitor capacitance="100nF" footprint="0402" name="C1" />
      <capacitor capacitance="100nF" footprint="0402" name="C2" />

      <trace from=".J1 .CC1" to=".R1 .pin1" />
      <trace from=".J1 .CC2" to=".R2 .pin1" />
      <trace from=".J1 .SBU1" to=".C1 .pin1" />
      <trace from=".J1 .SBU2" to=".C2 .pin1" />
    </board>,
  )

  expect(
    convertCircuitJsonToReadableNetlist(circuitJson),
  ).toMatchInlineSnapshot(`
    "COMPONENTS:
     - J1: USB-C-RECEPTACLE, soic8
     - R1: 5.1kΩ 0402 resistor
     - R2: 5.1kΩ 0402 resistor
     - C1: 100nF 0402 capacitor
     - C2: 100nF 0402 capacitor

    NET: J1_CC1
      - J1 CC1
      - R1 pin1

    NET: J1_CC2
      - J1 CC2
      - R2 pin1

    NET: J1_SBU1
      - J1 SBU1
      - C1 pin1 (+)

    NET: J1_SBU2
      - J1 SBU2
      - C2 pin1 (+)


    COMPONENT_PINS:
    J1 (USB-C-RECEPTACLE)
    - pin1(VBUS): NOT_CONNECTED
    - pin2(CC1): NETS(J1_CC1)
    - pin3(CC2): NETS(J1_CC2)
    - pin4(SBU1): NETS(J1_SBU1)
    - pin5(SBU2): NETS(J1_SBU2)
    - pin6(DP): NOT_CONNECTED
    - pin7(DN): NOT_CONNECTED
    - pin8(GND): NOT_CONNECTED

    R1 (5.1kΩ 0402)
    - pin1(anode, pos, left): NETS(J1_CC1)
    - pin2(cathode, neg, right): NOT_CONNECTED

    R2 (5.1kΩ 0402)
    - pin1(anode, pos, left): NETS(J1_CC2)
    - pin2(cathode, neg, right): NOT_CONNECTED

    C1 (100nF 0402)
    - pin1(pos, anode, left): NETS(J1_SBU1)
    - pin2(neg, cathode, right): NOT_CONNECTED

    C2 (100nF 0402)
    - pin1(pos, anode, left): NETS(J1_SBU2)
    - pin2(neg, cathode, right): NOT_CONNECTED
    "
  `)
})
