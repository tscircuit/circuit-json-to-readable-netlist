import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

declare module "bun:test" {
  interface Matchers<T = unknown> {
    toMatchInlineSnapshot(snapshot?: string | null): Promise<MatcherResult>
  }
}

it("scores single-pair ethernet pin labels before digit fallback", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="soic8"
        manufacturerPartNumber="LAN8670"
        pinLabels={{
          pin1: ["T1S_P1"],
          pin2: ["T1L_RXP1"],
          pin3: ["TC10_WAKE1"],
          pin4: ["OPENALLIANCE_IRQ1"],
        }}
      />
      <resistor resistance="1k" footprint="0402" name="R1" />
      <capacitor capacitance="1nF" footprint="0402" name="C1" />

      <trace from=".U1 .T1S_P1" to=".R1 .pin1" />
      <trace from=".U1 .T1L_RXP1" to=".C1 .pin1" />
      <trace from=".U1 .TC10_WAKE1" to=".R1 .pin2" />
      <trace from=".U1 .OPENALLIANCE_IRQ1" to=".C1 .pin2" />
    </board>,
  )

  expect(
    convertCircuitJsonToReadableNetlist(circuitJson),
  ).toMatchInlineSnapshot(`
    "COMPONENTS:
     - U1: LAN8670, soic8
     - R1: 1kΩ 0402 resistor
     - C1: 1nF 0402 capacitor

    NET: U1_T1S_P1
      - U1 T1S_P1
      - R1 pin1

    NET: U1_T1L_RXP1
      - U1 T1L_RXP1
      - C1 pin1 (+)

    NET: U1_TC10_WAKE1
      - U1 TC10_WAKE1
      - R1 pin2

    NET: U1_OPENALLIANCE_IRQ1
      - U1 OPENALLIANCE_IRQ1
      - C1 pin2 (-)


    COMPONENT_PINS:
    U1 (LAN8670)
    - pin1(T1S_P1): NETS(U1_T1S_P1)
    - pin2(T1L_RXP1): NETS(U1_T1L_RXP1)
    - pin3(TC10_WAKE1): NETS(U1_TC10_WAKE1)
    - pin4(OPENALLIANCE_IRQ1): NETS(U1_OPENALLIANCE_IRQ1)
    - pin5: NOT_CONNECTED
    - pin6: NOT_CONNECTED
    - pin7: NOT_CONNECTED
    - pin8: NOT_CONNECTED

    R1 (1kΩ 0402)
    - pin1(anode, pos, left): NETS(U1_T1S_P1)
    - pin2(cathode, neg, right): NETS(U1_TC10_WAKE1)

    C1 (1nF 0402)
    - pin1(pos, anode, left): NETS(U1_T1L_RXP1)
    - pin2(neg, cathode, right): NETS(U1_OPENALLIANCE_IRQ1)
    "
  `)
})
