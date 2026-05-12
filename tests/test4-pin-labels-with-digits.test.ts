import { expect, it } from "bun:test"
import { getReadableNameForPin } from "lib/getReadableNameForPin"

it("keeps descriptive pin labels that contain digits", () => {
  const circuitJson = [
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
      port_hints: ["GPIO14", "ADC2_CH6"],
    },
  ] as any

  expect(
    getReadableNameForPin({
      circuitJson,
      source_port_id: "source_port_1",
    }),
  ).toBe("U1 pin14 (GPIO14,ADC2_CH6)")
})
