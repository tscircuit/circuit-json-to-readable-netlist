import { expect, it } from "bun:test"
import { getReadableNameForPin } from "lib/getReadableNameForPin"

it("includes numeric chip pin labels instead of only the generic pin name", () => {
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
      port_hints: ["14", "pin14", "GPIO10", "SPI1_SCK"],
    },
  ] as any

  expect(
    getReadableNameForPin({
      circuitJson,
      source_port_id: "source_port_0",
    }),
  ).toBe("U1 pin14 (GPIO10,SPI1_SCK)")
})

it("falls back to stable ids instead of rendering undefined pin names", () => {
  const circuitJson = [
    {
      type: "source_component",
      source_component_id: "source_component_0",
      ftype: "simple_chip",
    },
    {
      type: "source_port",
      source_port_id: "source_port_0",
      source_component_id: "source_component_0",
      port_hints: ["GPIO10"],
    },
  ] as any

  expect(
    getReadableNameForPin({
      circuitJson,
      source_port_id: "source_port_0",
    }),
  ).toBe("source_component_0 GPIO10")
})
