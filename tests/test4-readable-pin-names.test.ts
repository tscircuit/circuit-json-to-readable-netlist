import { expect, it } from "bun:test"
import { getReadableNameForPin } from "lib/getReadableNameForPin"

it("uses descriptive port hints instead of generic pin names", () => {
  const circuitJson = [
    {
      type: "source_component",
      source_component_id: "source_component_0",
      ftype: "simple_chip",
      name: "U1",
      manufacturer_part_number: "PICO_W",
    },
    {
      type: "source_port",
      source_port_id: "source_port_13",
      name: "pin14",
      pin_number: 14,
      port_hints: ["GP10_SPI1SCK_I2C1SDA", "pin14", "14"],
      source_component_id: "source_component_0",
    },
  ] as any

  expect(
    getReadableNameForPin({
      circuitJson,
      source_port_id: "source_port_13",
    }),
  ).toBe("U1 GP10_SPI1SCK_I2C1SDA (pin14)")
})
