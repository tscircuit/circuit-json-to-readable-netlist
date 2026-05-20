import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

declare module "bun:test" {
  interface Matchers<T = unknown> {
    toMatchInlineSnapshot(snapshot?: string | null): Promise<MatcherResult>
  }
}

it("scores RF switch and attenuator pin labels before digit fallback", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="qfn12"
        manufacturerPartNumber="RF-SWITCH"
        pinLabels={{
          pin1: ["RFC"],
          pin2: ["RF1"],
          pin3: ["RF2"],
          pin4: ["VCTL1"],
          pin5: ["VCTL2"],
          pin6: ["CTRL1"],
          pin7: ["CTRL2"],
          pin8: ["ATTN1"],
          pin9: ["ATTN2"],
          pin10: ["VDD"],
          pin11: ["GND"],
          pin12: ["GND"],
        }}
      />
      <capacitor capacitance="100pF" footprint="0402" name="C1" />
      <resistor resistance="0" footprint="0402" name="R1" />
      <resistor resistance="0" footprint="0402" name="R2" />
      <resistor resistance="10k" footprint="0402" name="R3" />

      <trace from=".U1 .RFC" to=".C1 .pin1" />
      <trace from=".U1 .RF1" to=".R1 .pin1" />
      <trace from=".U1 .RF2" to=".R2 .pin1" />
      <trace from=".U1 .VCTL1" to=".R3 .pin1" />
    </board>,
  )

  expect(
    convertCircuitJsonToReadableNetlist(circuitJson),
  ).toMatchInlineSnapshot(`
    "COMPONENTS:
     - U1: RF-SWITCH, qfn12
     - C1: 100pF 0402 capacitor
     - R1: 0Ω 0402 resistor
     - R2: 0Ω 0402 resistor
     - R3: 10kΩ 0402 resistor

    NET: U1_RFC
      - U1 RFC
      - C1 pin1 (+)

    NET: U1_RF1
      - U1 RF1
      - R1 pin1

    NET: U1_RF2
      - U1 RF2
      - R2 pin1

    NET: U1_VCTL1
      - U1 VCTL1
      - R3 pin1


    COMPONENT_PINS:
    U1 (RF-SWITCH)
    - pin1(RFC): NETS(U1_RFC)
    - pin2(RF1): NETS(U1_RF1)
    - pin3(RF2): NETS(U1_RF2)
    - pin4(VCTL1): NETS(U1_VCTL1)
    - pin5(VCTL2): NOT_CONNECTED
    - pin6(CTRL1): NOT_CONNECTED
    - pin7(CTRL2): NOT_CONNECTED
    - pin8(ATTN1): NOT_CONNECTED
    - pin9(ATTN2): NOT_CONNECTED
    - pin10(VDD): NOT_CONNECTED
    - pin11(GND): NOT_CONNECTED
    - pin12(GND): NOT_CONNECTED

    C1 (100pF 0402)
    - pin1(pos, anode, left): NETS(U1_RFC)
    - pin2(neg, cathode, right): NOT_CONNECTED

    R1 (0Ω 0402)
    - pin1(anode, pos, left): NETS(U1_RF1)
    - pin2(cathode, neg, right): NOT_CONNECTED

    R2 (0Ω 0402)
    - pin1(anode, pos, left): NETS(U1_RF2)
    - pin2(cathode, neg, right): NOT_CONNECTED

    R3 (10kΩ 0402)
    - pin1(anode, pos, left): NETS(U1_VCTL1)
    - pin2(cathode, neg, right): NOT_CONNECTED
    "
  `)
})
