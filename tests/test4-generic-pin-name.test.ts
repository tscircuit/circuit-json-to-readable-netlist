import { expect, it } from "bun:test"
import { getReadableNameForPin } from "lib/getReadableNameForPin"

it("uses full pin labels instead of generic pin names", () => {
  expect(
    getReadableNameForPin({
      source_port_id: "source_port_1",
      circuitJson: [
        {
          type: "source_component",
          source_component_id: "source_component_1",
          name: "U1",
          ftype: "simple_chip",
        },
        {
          type: "source_port",
          source_port_id: "source_port_1",
          source_component_id: "source_component_1",
          name: "pin14",
          pin_number: 14,
          port_hints: ["14", "GPIO1", "SCL"],
        },
      ],
    }),
  ).toBe("U1 SCL (GPIO1)")
})
