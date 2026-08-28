import { expect, it } from "bun:test"
import { getReadableNameForPin } from "lib/getReadableNameForPin"
import { scorePhrase } from "lib/scorePhrase"

it("scores useful pin labels that contain numbers", () => {
  expect(scorePhrase("GPIO10")).toBeGreaterThan(1)
  expect(scorePhrase("GP10")).toBeGreaterThan(1)
  expect(scorePhrase("SPI1_SCK")).toBeGreaterThan(1)
  expect(scorePhrase("pin14")).toBeLessThan(1)
  expect(scorePhrase("14")).toBeLessThan(1)
})

it("includes useful aliases for generic chip pin names", () => {
  const circuitJson = [
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
      port_hints: ["GP10", "GPIO10", "SPI1_SCK", "pin14", "14"],
    },
  ] as any

  expect(
    getReadableNameForPin({
      circuitJson,
      source_port_id: "source_port_0",
    }),
  ).toBe("U1 pin14 (GP10,GPIO10,SPI1_SCK)")
})
