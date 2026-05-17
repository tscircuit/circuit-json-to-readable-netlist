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

it("passive components without footprints don't output undefined", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <resistor name="R1" resistance="10k" />
      <capacitor name="C1" capacitance="100nF" />
    </board>,
  )
  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)
  expect(netlist).not.toContain("undefined")
  expect(netlist).toContain("R1 (10kΩ)")
  expect(netlist).toContain("C1 (100nF)")
})
