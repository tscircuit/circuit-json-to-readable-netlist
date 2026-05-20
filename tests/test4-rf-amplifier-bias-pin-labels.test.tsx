import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

declare module "bun:test" {
  interface Matchers<T = unknown> {
    toMatchInlineSnapshot(snapshot?: string | null): Promise<MatcherResult>
  }
}

it("scores RF amplifier bias-control pin labels before digit fallback", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="soic8"
        manufacturerPartNumber="RF-PA-LNA-FRONTEND"
        pinLabels={{
          pin1: ["PAEN1"],
          pin2: ["LNAEN1"],
          pin3: ["PA_BIAS1"],
          pin4: ["LNA_BIAS1"],
          pin5: ["VPA1"],
          pin6: ["VLNA1"],
          pin7: ["VDD"],
          pin8: ["GND"],
        }}
      />
      <resistor resistance="10k" footprint="0402" name="R1" />
      <resistor resistance="10k" footprint="0402" name="R2" />
      <capacitor capacitance="100nF" footprint="0402" name="C1" />
      <capacitor capacitance="100nF" footprint="0402" name="C2" />

      <trace from=".U1 .PAEN1" to=".R1 .pin1" />
      <trace from=".U1 .LNAEN1" to=".R2 .pin1" />
      <trace from=".U1 .PA_BIAS1" to=".C1 .pin1" />
      <trace from=".U1 .LNA_BIAS1" to=".C2 .pin1" />
    </board>,
  )

  expect(
    convertCircuitJsonToReadableNetlist(circuitJson),
  ).toMatchInlineSnapshot(`
    "COMPONENTS:
     - U1: RF-PA-LNA-FRONTEND, soic8
     - R1: 10kΩ 0402 resistor
     - R2: 10kΩ 0402 resistor
     - C1: 100nF 0402 capacitor
     - C2: 100nF 0402 capacitor

    NET: U1_PAEN1
      - U1 PAEN1
      - R1 pin1

    NET: U1_LNAEN1
      - U1 LNAEN1
      - R2 pin1

    NET: U1_PA_BIAS1
      - U1 PA_BIAS1
      - C1 pin1 (+)

    NET: U1_LNA_BIAS1
      - U1 LNA_BIAS1
      - C2 pin1 (+)


    COMPONENT_PINS:
    U1 (RF-PA-LNA-FRONTEND)
    - pin1(PAEN1): NETS(U1_PAEN1)
    - pin2(LNAEN1): NETS(U1_LNAEN1)
    - pin3(PA_BIAS1): NETS(U1_PA_BIAS1)
    - pin4(LNA_BIAS1): NETS(U1_LNA_BIAS1)
    - pin5(VPA1): NOT_CONNECTED
    - pin6(VLNA1): NOT_CONNECTED
    - pin7(VDD): NOT_CONNECTED
    - pin8(GND): NOT_CONNECTED

    R1 (10kΩ 0402)
    - pin1(anode, pos, left): NETS(U1_PAEN1)
    - pin2(cathode, neg, right): NOT_CONNECTED

    R2 (10kΩ 0402)
    - pin1(anode, pos, left): NETS(U1_LNAEN1)
    - pin2(cathode, neg, right): NOT_CONNECTED

    C1 (100nF 0402)
    - pin1(pos, anode, left): NETS(U1_PA_BIAS1)
    - pin2(neg, cathode, right): NOT_CONNECTED

    C2 (100nF 0402)
    - pin1(pos, anode, left): NETS(U1_LNA_BIAS1)
    - pin2(neg, cathode, right): NOT_CONNECTED
    "
  `)
})
