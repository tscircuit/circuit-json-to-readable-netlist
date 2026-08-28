import { expect, it } from "bun:test"
import type { AnyCircuitElement } from "circuit-json"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"

declare module "bun:test" {
  interface Matchers<T = unknown> {
    toMatchInlineSnapshot(snapshot?: string | null): Promise<MatcherResult>
  }
}

it("uses readable descriptions for non resistor/capacitor components", () => {
  const circuitJson: AnyCircuitElement[] = [
    {
      type: "source_component",
      ftype: "simple_diode",
      source_component_id: "source_component_0",
      name: "D1",
    },
    {
      type: "source_component",
      ftype: "led",
      source_component_id: "source_component_1",
      name: "LED1",
      display_value: "red",
    },
    {
      type: "source_component",
      ftype: "simple_inductor",
      source_component_id: "source_component_2",
      name: "L1",
      inductance: 0.000001,
    },
  ]

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).not.toContain("source_component")
  expect(netlist).toMatchInlineSnapshot(`
    "COMPONENTS:
     - D1: diode
     - LED1: red led
     - L1: inductor


    COMPONENT_PINS:
    D1

    LED1

    L1
    "
  `)
})
