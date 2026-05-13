import { expect, it } from "bun:test"
import { getReadableNameForPin } from "lib/getReadableNameForPin"
import type { AnyCircuitElement } from "circuit-json"

it("keeps useful numeric pin labels in readable pin names", () => {
  const circuitJson: AnyCircuitElement[] = [
    {
      type: "source_component",
      source_component_id: "source_component_0",
      ftype: "simple_chip",
      name: "U1",
    } as any,
    {
      type: "source_port",
      source_port_id: "source_port_0",
      source_component_id: "source_component_0",
      name: "pin14",
      pin_number: 14,
      port_hints: ["pin14", "GPIO1", "SCL"],
    } as any,
  ]

  expect(
    getReadableNameForPin({
      circuitJson,
      source_port_id: "source_port_0",
    }),
  ).toBe("U1 pin14 (GPIO1,SCL)")
})
