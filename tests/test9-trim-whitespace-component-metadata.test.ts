import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"

it("trims whitespace-only padding in component metadata fields", () => {
  const circuitJson = [
    {
      type: "source_component",
      source_component_id: "source_component_0",
      name: "U1",
      ftype: "simple_chip",
      manufacturer_part_number: "  WS2812B_2020  ",
    },
    {
      type: "source_port",
      source_port_id: "source_port_0",
      source_component_id: "source_component_0",
      name: "DIN",
      pin_number: 1,
    },
    {
      type: "cad_component",
      source_component_id: "source_component_0",
      footprinter_string: "  2020  ",
    },
  ] as any

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("- U1: WS2812B_2020, 2020")
  expect(netlist).toContain("U1 (WS2812B_2020)")
  expect(netlist).not.toContain("  WS2812B_2020  ")
  expect(netlist).not.toContain("  2020  ")
})
