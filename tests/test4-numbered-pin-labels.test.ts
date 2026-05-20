import { expect, it } from "bun:test"
import type { AnyCircuitElement } from "circuit-json"
import { getReadableNameForPin } from "lib/getReadableNameForPin"

it("keeps useful numbered pin labels for generic pin names", () => {
  const circuitJson = [
    {
      type: "source_component",
      source_component_id: "source_component_0",
      name: "U1",
      ftype: "simple_chip",
      manufacturer_part_number: "RP2040",
    },
    {
      type: "source_port",
      source_port_id: "source_port_0",
      source_component_id: "source_component_0",
      name: "pin14",
      pin_number: 14,
      port_hints: ["pin14", "GP14", "GPIO14"],
    },
  ] as AnyCircuitElement[]

  expect(
    getReadableNameForPin({ circuitJson, source_port_id: "source_port_0" }),
  ).toBe("U1 pin14 (GP14,GPIO14)")
})
