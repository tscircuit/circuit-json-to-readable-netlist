import { expect, it } from "bun:test"
import { getReadableNameForPin } from "lib/getReadableNameForPin"
import { scorePhrase } from "lib/scorePhrase"

it("includes useful numbered chip pin labels when the port name is generic", () => {
  const circuitJson = [
    {
      type: "source_component",
      source_component_id: "source_component_1",
      ftype: "simple_chip",
      name: "U1",
    },
    {
      type: "source_port",
      source_port_id: "source_port_1",
      source_component_id: "source_component_1",
      name: "pin14",
      pin_number: 14,
      port_hints: ["pin14", "14", "GP10", "LED16_DI"],
    },
  ] as any

  expect(
    getReadableNameForPin({
      circuitJson,
      source_port_id: "source_port_1",
    }),
  ).toBe("U1 pin14 (GP10,LED16_DI)")
})

it("keeps passive pin names concise when their hints are low-information", () => {
  const circuitJson = [
    {
      type: "source_component",
      source_component_id: "source_component_1",
      ftype: "simple_resistor",
      name: "R1",
    },
    {
      type: "source_port",
      source_port_id: "source_port_1",
      source_component_id: "source_component_1",
      name: "pin1",
      pin_number: 1,
      port_hints: ["anode", "pos", "left"],
    },
  ] as any

  expect(
    getReadableNameForPin({
      circuitJson,
      source_port_id: "source_port_1",
    }),
  ).toBe("R1 pin1")
})

it("scores useful numbered GPIO labels higher than generic pin numbers", () => {
  expect(scorePhrase("GPIO1")).toBeGreaterThan(scorePhrase("pin14"))
  expect(scorePhrase("GP10")).toBeGreaterThan(scorePhrase("pin14"))
})
