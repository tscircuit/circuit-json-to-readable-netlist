import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

declare module "bun:test" {
  interface Matchers<T = unknown> {
    toMatchInlineSnapshot(snapshot?: string | null): Promise<MatcherResult>
  }
}

it("resistor and capacitor without footprint do not output undefined", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <resistor resistance="10k" name="R1" />
      <capacitor capacitance="100nF" name="C1" />
    </board>,
  )
  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)
  expect(netlist).not.toContain("undefined")
  expect(netlist).not.toContain("R1 (10kΩ undefined)")
  expect(netlist).not.toContain("C1 (100nF undefined)")
  expect(netlist).toMatchInlineSnapshot(`
    "COMPONENTS:
     - R1: 10kΩ resistor
     - C1: 100nF capacitor


    COMPONENT_PINS:
    R1 (10kΩ)
    - pin1(left): NOT_CONNECTED
    - pin2(right): NOT_CONNECTED

    C1 (100nF)
    - pos(pin1, anode, left): NOT_CONNECTED
    - neg(pin2, cathode, right): NOT_CONNECTED
    "
  `)
})
