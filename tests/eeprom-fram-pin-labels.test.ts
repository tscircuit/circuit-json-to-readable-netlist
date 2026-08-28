import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib"

it("preserves EEPROM and FRAM control aliases on generic pins", () => {
  const circuitJson = [
    {
      type: "source_component",
      source_component_id: "source_component_0",
      ftype: "simple_chip",
      name: "U1",
      manufacturer_part_number: "24LC256",
    },
    {
      type: "source_component",
      source_component_id: "source_component_1",
      ftype: "simple_resistor",
      name: "R1",
      display_resistance: "10k",
    },
    {
      type: "source_component",
      source_component_id: "source_component_2",
      ftype: "simple_resistor",
      name: "R2",
      display_resistance: "10k",
    },
    {
      type: "source_port",
      source_port_id: "source_port_0",
      source_component_id: "source_component_0",
      name: "pin7",
      pin_number: 7,
      port_hints: ["pin7", "EEPROM_WP1"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_1",
      source_component_id: "source_component_0",
      name: "pin3",
      pin_number: 3,
      port_hints: ["pin3", "FRAM_HOLD1"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_2",
      source_component_id: "source_component_1",
      name: "pin1",
      pin_number: 1,
      port_hints: ["pin1", "pos", "anode"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_3",
      source_component_id: "source_component_2",
      name: "pin1",
      pin_number: 1,
      port_hints: ["pin1", "pos", "anode"],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_0",
      connected_source_port_ids: ["source_port_0", "source_port_2"],
      connected_source_net_ids: [],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_1",
      connected_source_port_ids: ["source_port_1", "source_port_3"],
      connected_source_net_ids: [],
    },
  ] as any[]

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_EEPROM_WP1")
  expect(netlist).toContain("  - U1 pin7 (EEPROM_WP1)")
  expect(netlist).toContain("- pin7(EEPROM_WP1): NETS(U1_EEPROM_WP1)")
  expect(netlist).toContain("NET: U1_FRAM_HOLD1")
  expect(netlist).toContain("  - U1 pin3 (FRAM_HOLD1)")
  expect(netlist).toContain("- pin3(FRAM_HOLD1): NETS(U1_FRAM_HOLD1)")
})
