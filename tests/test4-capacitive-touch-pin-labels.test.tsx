import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

declare module "bun:test" {
  interface Matchers<T = unknown> {
    toMatchInlineSnapshot(snapshot?: string | null): Promise<MatcherResult>
  }
}

it("scores capacitive touch pin labels before digit fallback", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="soic8"
        manufacturerPartNumber="CAP-TOUCH-CTRL"
        pinLabels={{
          pin1: ["ELE0"],
          pin2: ["ELE1"],
          pin3: ["CIN1"],
          pin4: ["SHLD1"],
          pin5: ["CMOD"],
          pin6: ["IRQ"],
          pin7: ["SDA"],
          pin8: ["VDD"],
        }}
      />
      <resistor resistance="1M" footprint="0402" name="R1" />
      <capacitor capacitance="10nF" footprint="0402" name="C1" />
      <resistor resistance="100k" footprint="0402" name="R2" />
      <capacitor capacitance="100nF" footprint="0402" name="C2" />

      <trace from=".U1 .ELE0" to=".R1 .pin1" />
      <trace from=".U1 .CIN1" to=".C1 .pin1" />
      <trace from=".U1 .SHLD1" to=".R2 .pin1" />
      <trace from=".U1 .CMOD" to=".C2 .pin1" />
    </board>,
  )

  expect(
    convertCircuitJsonToReadableNetlist(circuitJson),
  ).toMatchInlineSnapshot(`
    "COMPONENTS:
     - U1: CAP-TOUCH-CTRL, soic8
     - R1: 1MΩ 0402 resistor
     - C1: 10nF 0402 capacitor
     - R2: 100kΩ 0402 resistor
     - C2: 100nF 0402 capacitor

    NET: U1_ELE0
      - U1 ELE0
      - R1 pin1

    NET: U1_CIN1
      - U1 CIN1
      - C1 pin1 (+)

    NET: U1_SHLD1
      - U1 SHLD1
      - R2 pin1

    NET: U1_CMOD
      - U1 CMOD
      - C2 pin1 (+)


    COMPONENT_PINS:
    U1 (CAP-TOUCH-CTRL)
    - pin1(ELE0): NETS(U1_ELE0)
    - pin2(ELE1): NOT_CONNECTED
    - pin3(CIN1): NETS(U1_CIN1)
    - pin4(SHLD1): NETS(U1_SHLD1)
    - pin5(CMOD): NETS(U1_CMOD)
    - pin6(IRQ): NOT_CONNECTED
    - pin7(SDA): NOT_CONNECTED
    - pin8(VDD): NOT_CONNECTED

    R1 (1MΩ 0402)
    - pin1(anode, pos, left): NETS(U1_ELE0)
    - pin2(cathode, neg, right): NOT_CONNECTED

    C1 (10nF 0402)
    - pin1(pos, anode, left): NETS(U1_CIN1)
    - pin2(neg, cathode, right): NOT_CONNECTED

    R2 (100kΩ 0402)
    - pin1(anode, pos, left): NETS(U1_SHLD1)
    - pin2(cathode, neg, right): NOT_CONNECTED

    C2 (100nF 0402)
    - pin1(pos, anode, left): NETS(U1_CMOD)
    - pin2(neg, cathode, right): NOT_CONNECTED
    "
  `)
})
