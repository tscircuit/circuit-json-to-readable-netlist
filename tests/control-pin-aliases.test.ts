import { expect, it } from "bun:test"
import { getReadableNameForPin } from "lib/getReadableNameForPin"
import type { AnyCircuitElement } from "circuit-json"

it("includes common control pin aliases for generic numbered chip pins", () => {
  const circuitJson = [
    {
      type: "source_component",
      source_component_id: "source_component_0",
      ftype: "simple_chip",
      name: "U1",
    },
    {
      type: "source_port",
      source_port_id: "source_port_0",
      source_component_id: "source_component_0",
      name: "pin14",
      pin_number: 14,
      port_hints: ["pin14", "RESET", "BOOT"],
    },
  ] as AnyCircuitElement[]

  expect(
    getReadableNameForPin({
      circuitJson,
      source_port_id: "source_port_0",
    }),
  ).toBe("U1 pin14 (RESET,BOOT)")
})
