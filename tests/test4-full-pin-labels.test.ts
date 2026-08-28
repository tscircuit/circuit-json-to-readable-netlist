import { expect, it } from "bun:test"
import type { AnyCircuitElement } from "circuit-json"
import { getReadableNameForPin } from "lib/getReadableNameForPin"
import { scorePhrase } from "lib/scorePhrase"

it("keeps alphanumeric chip pin labels readable", () => {
  const circuitJson: AnyCircuitElement[] = [
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_1",
      name: "U1",
    },
    {
      type: "source_port",
      source_port_id: "source_port_1",
      source_component_id: "source_component_1",
      name: "pin14",
      pin_number: 14,
      port_hints: ["pin14", "GPIO14", "SCL"],
    },
  ] as AnyCircuitElement[]

  expect(scorePhrase("GPIO14")).toBeGreaterThan(1)
  expect(
    getReadableNameForPin({
      circuitJson,
      source_port_id: "source_port_1",
    }),
  ).toBe("U1 pin14 (GPIO14,SCL)")
})
