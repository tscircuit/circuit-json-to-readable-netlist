import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { getReadableNameForPin } from "lib/getReadableNameForPin"

it("uses readable chip labels in component pins", () => {
  const circuitJson = [
    {
      type: "source_component",
      source_component_id: "source_component_0",
      name: "U1",
      ftype: "simple_chip",
      manufacturer_part_number: "TEST_CHIP",
    },
    {
      type: "source_port",
      source_port_id: "source_port_0",
      source_component_id: "source_component_0",
      name: "pin1",
      pin_number: 1,
      port_hints: ["GPIO1", "SCL"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_1",
      source_component_id: "source_component_0",
      name: "GND",
      pin_number: 2,
      port_hints: ["GND"],
    },
  ] as any[]

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(
    getReadableNameForPin({
      circuitJson,
      source_port_id: "source_port_0",
    }),
  ).toBe("U1 GPIO1 (SCL)")
  expect(netlist).toContain("- GPIO1(pin1, SCL): NOT_CONNECTED")
  expect(netlist).toContain("- GND(pin2): NOT_CONNECTED")
  expect(netlist).not.toContain("undefined")
})

it("omits missing footprints from component pin headers", () => {
  const circuitJson = [
    {
      type: "source_component",
      source_component_id: "source_component_0",
      name: "R1",
      ftype: "simple_resistor",
      display_resistance: "1k",
    },
    {
      type: "source_component",
      source_component_id: "source_component_1",
      name: "C1",
      ftype: "simple_capacitor",
      display_capacitance: "1nF",
    },
    {
      type: "source_port",
      source_port_id: "source_port_0",
      source_component_id: "source_component_0",
      pin_number: 1,
      port_hints: ["anode", "pos", "left"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_1",
      source_component_id: "source_component_1",
      pin_number: 1,
      port_hints: ["pos", "anode", "left"],
    },
  ] as any[]

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).not.toContain("undefined")
})
