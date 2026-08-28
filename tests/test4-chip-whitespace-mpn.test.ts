import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"

it("trims blank chip part numbers and falls back to footprint text", () => {
  const circuitJson = [
    {
      type: "source_component",
      source_component_id: "U1",
      name: "U1",
      ftype: "simple_chip",
      manufacturer_part_number: "   ",
    },
    {
      type: "cad_component",
      source_component_id: "U1",
      footprinter_string: "  soic8  ",
    },
  ]

  expect(
    convertCircuitJsonToReadableNetlist(circuitJson as any),
  ).toMatchInlineSnapshot(`
    "COMPONENTS:
     - U1: soic8


    COMPONENT_PINS:
    U1 (soic8)
    "
  `)
})
