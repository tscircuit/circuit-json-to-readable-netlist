import { expect, it } from "bun:test"
import type { AnyCircuitElement } from "circuit-json"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"

declare module "bun:test" {
  interface Matchers<T = unknown> {
    toMatchInlineSnapshot(snapshot?: string | null): Promise<MatcherResult>
  }
}

it("uses chip display value when manufacturer part number is absent", () => {
  const circuitJson: AnyCircuitElement[] = [
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_0",
      name: "U1",
      display_value: "RP2040",
    },
    {
      type: "cad_component",
      cad_component_id: "cad_component_0",
      pcb_component_id: "pcb_component_0",
      source_component_id: "source_component_0",
      position: { x: 0, y: 0, z: 0 },
      footprinter_string: "qfn56",
    },
  ]

  expect(
    convertCircuitJsonToReadableNetlist(circuitJson),
  ).toMatchInlineSnapshot(`
    "COMPONENTS:
     - U1: RP2040, qfn56


    COMPONENT_PINS:
    U1 (RP2040)
    "
  `)
})
