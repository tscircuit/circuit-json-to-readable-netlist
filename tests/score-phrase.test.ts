import { expect, it } from "bun:test"
import { generateNetName } from "lib/generateNetName"
import { scorePhrase } from "lib/scorePhrase"

it("scores known technical labels before applying the digit fallback", () => {
  expect(scorePhrase("pin14_3v3")).toBeGreaterThan(scorePhrase("pin14"))
  expect(scorePhrase("gpio10")).toBeGreaterThan(scorePhrase("pin10"))
  expect(scorePhrase("  vdd1  ")).toBeGreaterThan(scorePhrase("pin1"))
})

it("uses the more descriptive digit-bearing port hint when generating net names", () => {
  const circuitJson = [
    {
      type: "source_component",
      source_component_id: "source_component_1",
      ftype: "simple_chip",
      name: "U1",
      manufacturer_part_number: "MCU",
    },
    {
      type: "source_port",
      source_port_id: "source_port_1",
      source_component_id: "source_component_1",
      name: "pin14",
      pin_number: 14,
      port_hints: ["pin14", "pin14_3v3"],
    },
    {
      type: "source_component",
      source_component_id: "source_component_2",
      ftype: "simple_resistor",
      name: "R1",
      display_resistance: "10k",
    },
    {
      type: "source_port",
      source_port_id: "source_port_2",
      source_component_id: "source_component_2",
      name: "pin1",
      pin_number: 1,
      port_hints: ["pin1", "pos"],
    },
  ] as any

  expect(
    generateNetName({
      circuitJson,
      connectedIds: ["source_port_1", "source_port_2"],
    }),
  ).toBe("U1_pin14_3v3")
})
