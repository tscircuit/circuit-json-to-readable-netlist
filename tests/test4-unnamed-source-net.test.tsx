import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

declare module "bun:test" {
  interface Matchers<T = unknown> {
    toMatchInlineSnapshot(snapshot?: string | null): Promise<MatcherResult>
  }
}

it("uses connected pin labels when a source net has no name", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="soic8"
        manufacturerPartNumber="ATMEGA328P"
        pinLabels={{
          pin1: ["GND"],
          pin2: ["AGND"],
          pin3: ["GPIO1", "SCL"],
        }}
      />
      <trace from=".U1 .GND" to="net.GND" />
      <trace from=".U1 .AGND" to="net.GND" />
      <trace from=".U1 .GPIO1" to="net.GND" />
    </board>,
  )

  const circuitJsonWithUnnamedSourceNet = circuitJson.map((element) => ({
    ...element,
  }))
  for (const element of circuitJsonWithUnnamedSourceNet) {
    if (element.type === "source_net" && element.name === "GND") {
      const unnamedSourceNet = element as Partial<typeof element>
      unnamedSourceNet.name = undefined
    }
  }

  expect(
    convertCircuitJsonToReadableNetlist(circuitJsonWithUnnamedSourceNet),
  ).toMatchInlineSnapshot(`
    "COMPONENTS:
     - U1: ATMEGA328P, soic8

    NET: U1_SCL
      - U1 GPIO1 (SCL)
      - U1 AGND
      - U1 GND


    COMPONENT_PINS:
    U1 (ATMEGA328P)
    - pin1(GND): NETS(U1_SCL)
    - pin2(AGND): NETS(U1_SCL)
    - pin3(GPIO1, SCL): NETS(U1_SCL)
    - pin4: NOT_CONNECTED
    - pin5: NOT_CONNECTED
    - pin6: NOT_CONNECTED
    - pin7: NOT_CONNECTED
    - pin8: NOT_CONNECTED
    "
  `)
})
