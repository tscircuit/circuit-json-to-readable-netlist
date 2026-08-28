import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

declare module "bun:test" {
  interface Matchers<T = unknown> {
    toMatchInlineSnapshot(snapshot?: string | null): Promise<MatcherResult>
  }
}

it("preserves digit-bearing power bus pin labels in generated net names", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="soic8"
        manufacturerPartNumber="BQ25798"
        pinLabels={{
          pin1: ["PMBUS_ALERT1"],
          pin2: ["SMBUS_SCL1"],
        }}
      />
      <resistor resistance="10k" footprint="0402" name="R1" />

      <trace from=".U1 .PMBUS_ALERT1" to=".R1 > .pin1" />
    </board>,
  )

  expect(
    convertCircuitJsonToReadableNetlist(circuitJson),
  ).toMatchInlineSnapshot(`
    "COMPONENTS:
     - U1: BQ25798, soic8
     - R1: 10kΩ 0402 resistor

    NET: U1_PMBUS_ALERT1
      - U1 PMBUS_ALERT1
      - R1 pin1


    COMPONENT_PINS:
    U1 (BQ25798)
    - pin1(PMBUS_ALERT1): NETS(U1_PMBUS_ALERT1)
    - pin2(SMBUS_SCL1): NOT_CONNECTED
    - pin3: NOT_CONNECTED
    - pin4: NOT_CONNECTED
    - pin5: NOT_CONNECTED
    - pin6: NOT_CONNECTED
    - pin7: NOT_CONNECTED
    - pin8: NOT_CONNECTED

    R1 (10kΩ 0402)
    - pin1(anode, pos, left): NETS(U1_PMBUS_ALERT1)
    - pin2(cathode, neg, right): NOT_CONNECTED
    "
  `)
})
