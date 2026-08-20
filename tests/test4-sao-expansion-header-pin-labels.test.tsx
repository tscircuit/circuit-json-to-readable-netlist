import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

declare module "bun:test" {
  interface Matchers<T = unknown> {
    toMatchInlineSnapshot(snapshot?: string | null): Promise<MatcherResult>
  }
}

it("preserves SAO expansion-header labels in generated net names", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="soic8"
        manufacturerPartNumber="SAO-CONTROLLER"
        pinLabels={{
          pin1: ["SAO_GPIO1"],
          pin2: ["SAO_SDA1"],
          pin3: ["SAO_SCL1"],
        }}
      />
      <resistor resistance="1k" footprint="0402" name="R1" />
      <capacitor capacitance="1nF" footprint="0402" name="C1" />

      <trace from=".U1 .SAO_GPIO1" to=".R1 .pin1" />
      <trace from=".U1 .SAO_SDA1" to=".C1 .pin1" />
      <trace from=".U1 .SAO_SCL1" to=".R1 .pin2" />
    </board>,
  )

  expect(
    convertCircuitJsonToReadableNetlist(circuitJson),
  ).toMatchInlineSnapshot(`
    "COMPONENTS:
     - U1: SAO-CONTROLLER, soic8
     - R1: 1kΩ 0402 resistor
     - C1: 1nF 0402 capacitor

    NET: U1_SAO_GPIO1
      - U1 SAO_GPIO1
      - R1 pin1

    NET: U1_SAO_SDA1
      - U1 SAO_SDA1
      - C1 pin1 (+)

    NET: U1_SAO_SCL1
      - U1 SAO_SCL1
      - R1 pin2


    COMPONENT_PINS:
    U1 (SAO-CONTROLLER)
    - pin1(SAO_GPIO1): NETS(U1_SAO_GPIO1)
    - pin2(SAO_SDA1): NETS(U1_SAO_SDA1)
    - pin3(SAO_SCL1): NETS(U1_SAO_SCL1)
    - pin4: NOT_CONNECTED
    - pin5: NOT_CONNECTED
    - pin6: NOT_CONNECTED
    - pin7: NOT_CONNECTED
    - pin8: NOT_CONNECTED

    R1 (1kΩ 0402)
    - pin1(anode, pos, left): NETS(U1_SAO_GPIO1)
    - pin2(cathode, neg, right): NETS(U1_SAO_SCL1)

    C1 (1nF 0402)
    - pin1(pos, anode, left): NETS(U1_SAO_SDA1)
    - pin2(neg, cathode, right): NOT_CONNECTED
    "
  `)
})
