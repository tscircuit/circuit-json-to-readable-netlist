import { expect, it } from "bun:test"
import { getReadableNameForPin } from "lib/getReadableNameForPin"

it("includes chip pin labels when the port name is only a generic pin number", () => {
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
      port_hints: ["14", "GPIO6", "SPI0_SCK"],
    },
  ]

  expect(
    getReadableNameForPin({
      circuitJson: circuitJson as any,
      source_port_id: "source_port_1",
    }),
  ).toBe("U1 pin14 (GPIO6,SPI0_SCK)")
})

it("does not add low-signal passive component pin hints to net entries", () => {
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
      port_hints: ["1", "anode", "pos", "left"],
    },
  ]

  expect(
    getReadableNameForPin({
      circuitJson: circuitJson as any,
      source_port_id: "source_port_1",
    }),
  ).toBe("R1 pin1")
})
