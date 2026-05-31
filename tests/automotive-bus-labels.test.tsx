import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

declare module "bun:test" {
  interface Matchers<T = unknown> {
    toMatchInlineSnapshot(snapshot?: string | null): Promise<MatcherResult>
  }
}

it("preserves digit-bearing automotive bus labels in generated net names", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="soic8"
        manufacturerPartNumber="TJA1051"
        pinLabels={{
          pin1: ["CAN1"],
          pin2: ["LIN1"],
        }}
      />
      <resistor resistance="10k" footprint="0402" name="R1" />

      <trace from=".U1 .CAN1" to=".R1 > .pin1" />
    </board>,
  )

  expect(
    convertCircuitJsonToReadableNetlist(circuitJson),
  ).toMatchInlineSnapshot(`
    "COMPONENTS:
     - U1: TJA1051, soic8
     - R1: 10kΩ 0402 resistor

    NET: U1_CAN1
      - U1 CAN1
      - R1 pin1


    COMPONENT_PINS:
    U1 (TJA1051)
    - pin1(CAN1): NETS(U1_CAN1)
    - pin2(LIN1): NOT_CONNECTED
    - pin3: NOT_CONNECTED
    - pin4: NOT_CONNECTED
    - pin5: NOT_CONNECTED
    - pin6: NOT_CONNECTED
    - pin7: NOT_CONNECTED
    - pin8: NOT_CONNECTED

    R1 (10kΩ 0402)
    - pin1(anode, pos, left): NETS(U1_CAN1)
    - pin2(cathode, neg, right): NOT_CONNECTED
    "
  `)
})
