import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

declare module "bun:test" {
  interface Matchers<T = unknown> {
    toMatchInlineSnapshot(snapshot?: string | null): Promise<MatcherResult>
  }
}

it("chip without footprint doesn't output undefined", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip name="LED1" manufacturerPartNumber="WS2812B_2020" />
    </board>,
  )
  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)
  expect(netlist).not.toContain("undefined")
  expect(netlist).toMatchInlineSnapshot(`
    "COMPONENTS:
     - LED1: WS2812B_2020


    COMPONENT_PINS:
    LED1 (WS2812B_2020)
    "
  `)
})
