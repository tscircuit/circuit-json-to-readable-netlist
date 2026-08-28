import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"

it("uses descriptive pin hints instead of generic pin names", () => {
  const circuitJson = [
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_1",
      name: "U1",
      manufacturer_part_number: "RP2040",
    },
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_2",
      name: "J1",
    },
    {
      type: "source_port",
      source_port_id: "source_port_1",
      source_component_id: "source_component_1",
      name: "pin14",
      pin_number: 14,
      port_hints: ["14", "pin14", "GP10", "SPI1_SCK"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_2",
      source_component_id: "source_component_2",
      name: "SCK",
      pin_number: 1,
      port_hints: ["SCK"],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_1",
      connected_source_port_ids: ["source_port_1", "source_port_2"],
      connected_source_net_ids: [],
    },
  ] as any

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("  - U1 GP10 (pin14,SPI1_SCK)")
  expect(netlist).not.toContain("  - U1 pin14")
  expect(netlist).toContain("- pin14(GP10, SPI1_SCK): NETS(")
})

it("does not print undefined when passives have no footprint", () => {
  const circuitJson = [
    {
      type: "source_component",
      ftype: "simple_resistor",
      source_component_id: "source_component_1",
      name: "R1",
      resistance: 10000,
      display_resistance: "10kΩ",
    },
    {
      type: "source_component",
      ftype: "simple_capacitor",
      source_component_id: "source_component_2",
      name: "C1",
      capacitance: 1e-7,
      display_capacitance: "100nF",
    },
  ] as any

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).not.toContain("undefined")
  expect(netlist).toContain("R1 (10kΩ)")
  expect(netlist).toContain("C1 (100nF)")
})
