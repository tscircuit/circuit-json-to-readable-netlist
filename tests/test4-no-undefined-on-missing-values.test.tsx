import { expect, it } from "bun:test"
import type { AnyCircuitElement } from "circuit-json"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"

declare module "bun:test" {
  interface Matchers<T = unknown> {
    toMatchInlineSnapshot(snapshot?: string | null): Promise<MatcherResult>
  }
}

// Regression for issue #4: a resistor or capacitor whose `display_resistance`
// or `display_capacitance` is missing must not leak the literal string
// "undefined" into the readable netlist output.
it("resistor without display_resistance does not output 'undefined'", () => {
  const circuitJson: AnyCircuitElement[] = [
    {
      type: "source_component",
      source_component_id: "src_R1",
      name: "R1",
      ftype: "simple_resistor",
      // display_resistance intentionally omitted
    } as any,
  ]
  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)
  expect(netlist).not.toContain("undefined")
})

it("capacitor without display_capacitance does not output 'undefined'", () => {
  const circuitJson: AnyCircuitElement[] = [
    {
      type: "source_component",
      source_component_id: "src_C1",
      name: "C1",
      ftype: "simple_capacitor",
      // display_capacitance intentionally omitted
    } as any,
  ]
  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)
  expect(netlist).not.toContain("undefined")
})
