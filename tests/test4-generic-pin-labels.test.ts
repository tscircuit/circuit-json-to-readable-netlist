import { expect, it } from "bun:test"
import type { AnyCircuitElement } from "circuit-json"
import { getReadableNameForPin } from "lib/getReadableNameForPin"

it("includes useful labels for generic pin names", () => {
  const circuitJson: AnyCircuitElement[] = [
    {
      type: "source_component",
      source_component_id: "source_component_0",
      name: "U1",
      ftype: "simple_chip",
    },
    {
      type: "source_port",
      source_port_id: "source_port_0",
      source_component_id: "source_component_0",
      name: "pin14",
      pin_number: 14,
      port_hints: ["pin14", "14", "GPIO10", "SPI1_SCK"],
    },
  ]

  expect(
    getReadableNameForPin({
      circuitJson,
      source_port_id: "source_port_0",
    }),
  ).toBe("U1 pin14 (GPIO10,SPI1_SCK)")
})
