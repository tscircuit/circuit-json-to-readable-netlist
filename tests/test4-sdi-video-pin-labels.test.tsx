import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

declare module "bun:test" {
  interface Matchers<T = unknown> {
    toMatchInlineSnapshot(snapshot?: string | null): Promise<MatcherResult>
  }
}

it("scores SDI video pin labels before digit fallback", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="soic8"
        manufacturerPartNumber="SDI-RECLOCKER"
        pinLabels={{
          pin1: ["SDI0"],
          pin2: ["SDI1"],
          pin3: ["SDO0"],
          pin4: ["SDO1"],
          pin5: ["RATESEL0"],
          pin6: ["EQCTRL0"],
          pin7: ["LOCK"],
          pin8: ["VDD"],
        }}
      />
      <resistor resistance="75" footprint="0402" name="R1" />
      <resistor resistance="75" footprint="0402" name="R2" />
      <capacitor capacitance="100nF" footprint="0402" name="C1" />
      <resistor resistance="10k" footprint="0402" name="R3" />

      <trace from=".U1 .SDI0" to=".R1 .pin1" />
      <trace from=".U1 .SDO0" to=".R2 .pin1" />
      <trace from=".U1 .RATESEL0" to=".C1 .pin1" />
      <trace from=".U1 .EQCTRL0" to=".R3 .pin1" />
    </board>,
  )

  expect(
    convertCircuitJsonToReadableNetlist(circuitJson),
  ).toMatchInlineSnapshot(`
    "COMPONENTS:
     - U1: SDI-RECLOCKER, soic8
     - R1: 75Ω 0402 resistor
     - R2: 75Ω 0402 resistor
     - C1: 100nF 0402 capacitor
     - R3: 10kΩ 0402 resistor

    NET: U1_SDI0
      - U1 SDI0
      - R1 pin1

    NET: U1_SDO0
      - U1 SDO0
      - R2 pin1

    NET: U1_RATESEL0
      - U1 RATESEL0
      - C1 pin1 (+)

    NET: U1_EQCTRL0
      - U1 EQCTRL0
      - R3 pin1


    COMPONENT_PINS:
    U1 (SDI-RECLOCKER)
    - pin1(SDI0): NETS(U1_SDI0)
    - pin2(SDI1): NOT_CONNECTED
    - pin3(SDO0): NETS(U1_SDO0)
    - pin4(SDO1): NOT_CONNECTED
    - pin5(RATESEL0): NETS(U1_RATESEL0)
    - pin6(EQCTRL0): NETS(U1_EQCTRL0)
    - pin7(LOCK): NOT_CONNECTED
    - pin8(VDD): NOT_CONNECTED

    R1 (75Ω 0402)
    - pin1(anode, pos, left): NETS(U1_SDI0)
    - pin2(cathode, neg, right): NOT_CONNECTED

    R2 (75Ω 0402)
    - pin1(anode, pos, left): NETS(U1_SDO0)
    - pin2(cathode, neg, right): NOT_CONNECTED

    C1 (100nF 0402)
    - pin1(pos, anode, left): NETS(U1_RATESEL0)
    - pin2(neg, cathode, right): NOT_CONNECTED

    R3 (10kΩ 0402)
    - pin1(anode, pos, left): NETS(U1_EQCTRL0)
    - pin2(cathode, neg, right): NOT_CONNECTED
    "
  `)
})
