import { expect, it } from "bun:test"
import type { AnyCircuitElement } from "circuit-json"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"

declare module "bun:test" {
  interface Matchers<T = unknown> {
    toMatchInlineSnapshot(snapshot?: string | null): Promise<MatcherResult>
  }
}

it("omits blank passive footprints from readable labels", () => {
  const circuitJson = [
    {
      type: "source_component",
      source_component_id: "source_component_1",
      ftype: "simple_resistor",
      name: "R1",
      display_resistance: "1k",
    },
    {
      type: "cad_component",
      cad_component_id: "cad_component_1",
      source_component_id: "source_component_1",
      footprinter_string: "   ",
    },
    {
      type: "source_port",
      source_port_id: "source_port_1",
      source_component_id: "source_component_1",
      name: "pin1",
      pin_number: 1,
      port_hints: ["pos"],
    },
    {
      type: "source_component",
      source_component_id: "source_component_2",
      ftype: "simple_capacitor",
      name: "C1",
      display_capacitance: "100nF",
    },
    {
      type: "cad_component",
      cad_component_id: "cad_component_2",
      source_component_id: "source_component_2",
      footprinter_string: "\t",
    },
    {
      type: "source_port",
      source_port_id: "source_port_2",
      source_component_id: "source_component_2",
      name: "pin1",
      pin_number: 1,
      port_hints: ["pos"],
    },
  ] as AnyCircuitElement[]

  expect(
    convertCircuitJsonToReadableNetlist(circuitJson),
  ).toMatchInlineSnapshot(`
    "COMPONENTS:
     - R1: 1k resistor
     - C1: 100nF capacitor


    COMPONENT_PINS:
    R1 (1k)
    - pin1(pos): NOT_CONNECTED

    C1 (100nF)
    - pin1(pos): NOT_CONNECTED
    "
  `)
})
