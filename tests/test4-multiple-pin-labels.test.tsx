import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

declare module "bun:test" {
  interface Matchers<T = unknown> {
    toMatchInlineSnapshot(snapshot?: string | null): Promise<MatcherResult>
  }
}

it("formats multiple readable pin labels with spaces", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="soic8"
        manufacturerPartNumber="ATMEGA328P"
        pinLabels={{
          pin1: ["GPIO1", "SCL", "SDA"],
        }}
      />
      <resistor resistance="1k" footprint="0402" name="R1" />
      <trace from=".U1 .GPIO1" to=".R1 .pin1" />
    </board>,
  )

  expect(
    convertCircuitJsonToReadableNetlist(circuitJson),
  ).toMatchInlineSnapshot(`
    "COMPONENTS:
     - U1: ATMEGA328P, soic8
     - R1: 1kΩ 0402 resistor

    NET: U1_SCL
      - U1 GPIO1 (SCL, SDA)
      - R1 pin1


    COMPONENT_PINS:
    U1 (ATMEGA328P)
    - pin1(GPIO1, SCL, SDA): NETS(U1_SCL)
    - pin2: NOT_CONNECTED
    - pin3: NOT_CONNECTED
    - pin4: NOT_CONNECTED
    - pin5: NOT_CONNECTED
    - pin6: NOT_CONNECTED
    - pin7: NOT_CONNECTED
    - pin8: NOT_CONNECTED

    R1 (1kΩ 0402)
    - pin1(anode, pos, left): NETS(U1_SCL)
    - pin2(cathode, neg, right): NOT_CONNECTED
    "
  `)
})
