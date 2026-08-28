import { expect, it } from "bun:test"
import { generateNetName } from "lib/generateNetName"
import { scorePhrase } from "lib/scorePhrase"

it("scores known technical labels before the generic digit fallback", () => {
  expect(scorePhrase("GPIO1")).toBe(1.1)
  expect(scorePhrase("GPIO1_RX")).toBe(1.15)
  expect(scorePhrase("J42")).toBe(0.5)
})

it("uses digit-bearing technical hints when generating net names", () => {
  const circuitJson = [
    {
      type: "source_component",
      source_component_id: "source_component_0",
      name: "U1",
      ftype: "simple_chip",
    },
    {
      type: "source_component",
      source_component_id: "source_component_1",
      name: "C1",
      ftype: "simple_capacitor",
    },
    {
      type: "source_port",
      source_port_id: "source_port_0",
      source_component_id: "source_component_0",
      name: "pin1",
      pin_number: 1,
      port_hints: ["GPIO1_RX"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_1",
      source_component_id: "source_component_1",
      name: "pin1",
      pin_number: 1,
      port_hints: ["pos", "anode"],
    },
  ] as any

  expect(
    generateNetName({
      circuitJson,
      connectedIds: ["source_port_0", "source_port_1"],
    }),
  ).toBe("U1_GPIO1_RX")
})
