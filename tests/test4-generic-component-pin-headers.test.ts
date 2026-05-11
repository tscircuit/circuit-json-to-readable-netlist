import { expect, it } from "bun:test"
import type { AnyCircuitElement } from "circuit-json"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"

it("uses generic component metadata in COMPONENT_PINS headers", () => {
  const circuitJson: AnyCircuitElement[] = [
    {
      type: "source_component",
      ftype: "led",
      source_component_id: "source_component_led",
      name: "LED1",
      display_value: "red",
    },
    {
      type: "source_component",
      ftype: "simple_inductor",
      source_component_id: "source_component_l1",
      name: "L1",
      inductance: 0.00001,
      display_value: "10uH",
    },
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_u1",
      name: "U1",
    },
  ]

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)
  const componentPins = netlist.split("COMPONENT_PINS:\n")[1]

  expect(componentPins).toContain("LED1 (red led)")
  expect(componentPins).toContain("L1 (10uH inductor)")
  expect(componentPins).toContain("U1\n")
  expect(componentPins).not.toContain("U1 (chip)")
})
