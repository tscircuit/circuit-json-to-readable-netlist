import { expect, it } from "bun:test"
import type { AnyCircuitElement } from "circuit-json"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"

declare module "bun:test" {
  interface Matchers<T = unknown> {
    toMatchInlineSnapshot(snapshot?: string | null): Promise<MatcherResult>
  }
}

it("uses readable chip pin labels before pin numbers in component pins", () => {
  const circuitJson: AnyCircuitElement[] = [
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_0",
      name: "U1",
      manufacturer_part_number: "TEST_CHIP",
    },
    {
      type: "cad_component",
      cad_component_id: "cad_component_0",
      pcb_component_id: "pcb_component_0",
      source_component_id: "source_component_0",
      footprinter_string: "soic16",
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
    },
    {
      type: "source_port",
      source_port_id: "source_port_0",
      source_component_id: "source_component_0",
      name: "GPIO12",
      pin_number: 13,
      port_hints: ["pin13", "GPIO12"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_1",
      source_component_id: "source_component_0",
      name: "GPIO13",
      pin_number: 14,
      port_hints: ["pin14", "GPIO13"],
    },
  ]

  expect(
    convertCircuitJsonToReadableNetlist(circuitJson),
  ).toMatchInlineSnapshot(`
    "COMPONENTS:
     - U1: TEST_CHIP, soic16


    COMPONENT_PINS:
    U1 (TEST_CHIP)
    - GPIO12(pin13): NOT_CONNECTED
    - GPIO13(pin14): NOT_CONNECTED
    "
  `)
})
