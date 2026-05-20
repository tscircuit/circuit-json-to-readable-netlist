import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

declare module "bun:test" {
  interface Matchers<T = unknown> {
    toMatchInlineSnapshot(snapshot?: string | null): Promise<MatcherResult>
  }
}

it("scores proximity sensor pin labels before digit fallback", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="soic8"
        manufacturerPartNumber="PROX-SENSOR"
        pinLabels={{
          pin1: ["IND_PROX1"],
          pin2: ["CAP_PROX1"],
          pin3: ["PROX_OUT1"],
          pin4: ["PNP_NO1"],
          pin5: ["VDD"],
          pin6: ["GND"],
          pin7: ["GPIO1"],
          pin8: ["GPIO2"],
        }}
      />
      <resistor resistance="4.7k" footprint="0402" name="R1" />
      <resistor resistance="4.7k" footprint="0402" name="R2" />
      <capacitor capacitance="100nF" footprint="0402" name="C1" />
      <capacitor capacitance="100nF" footprint="0402" name="C2" />

      <trace from=".U1 .IND_PROX1" to=".R1 .pin1" />
      <trace from=".U1 .CAP_PROX1" to=".R2 .pin1" />
      <trace from=".U1 .PROX_OUT1" to=".C1 .pin1" />
      <trace from=".U1 .PNP_NO1" to=".C2 .pin1" />
    </board>,
  )

  expect(
    convertCircuitJsonToReadableNetlist(circuitJson),
  ).toMatchInlineSnapshot(`
    "COMPONENTS:
     - U1: PROX-SENSOR, soic8
     - R1: 4.7kΩ 0402 resistor
     - R2: 4.7kΩ 0402 resistor
     - C1: 100nF 0402 capacitor
     - C2: 100nF 0402 capacitor

    NET: U1_IND_PROX1
      - U1 IND_PROX1
      - R1 pin1

    NET: U1_CAP_PROX1
      - U1 CAP_PROX1
      - R2 pin1

    NET: U1_PROX_OUT1
      - U1 PROX_OUT1
      - C1 pin1 (+)

    NET: U1_PNP_NO1
      - U1 PNP_NO1
      - C2 pin1 (+)


    COMPONENT_PINS:
    U1 (PROX-SENSOR)
    - pin1(IND_PROX1): NETS(U1_IND_PROX1)
    - pin2(CAP_PROX1): NETS(U1_CAP_PROX1)
    - pin3(PROX_OUT1): NETS(U1_PROX_OUT1)
    - pin4(PNP_NO1): NETS(U1_PNP_NO1)
    - pin5(VDD): NOT_CONNECTED
    - pin6(GND): NOT_CONNECTED
    - pin7(GPIO1): NOT_CONNECTED
    - pin8(GPIO2): NOT_CONNECTED

    R1 (4.7kΩ 0402)
    - pin1(anode, pos, left): NETS(U1_IND_PROX1)
    - pin2(cathode, neg, right): NOT_CONNECTED

    R2 (4.7kΩ 0402)
    - pin1(anode, pos, left): NETS(U1_CAP_PROX1)
    - pin2(cathode, neg, right): NOT_CONNECTED

    C1 (100nF 0402)
    - pin1(pos, anode, left): NETS(U1_PROX_OUT1)
    - pin2(neg, cathode, right): NOT_CONNECTED

    C2 (100nF 0402)
    - pin1(pos, anode, left): NETS(U1_PNP_NO1)
    - pin2(neg, cathode, right): NOT_CONNECTED
    "
  `)
})
