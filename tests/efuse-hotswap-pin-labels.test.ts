import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib"

it("preserves eFuse and hot-swap aliases on generic pins", () => {
  const circuitJson = [
    {
      type: "source_component",
      source_component_id: "source_component_0",
      ftype: "simple_chip",
      name: "U1",
      manufacturer_part_number: "TPS25947",
    },
    {
      type: "source_component",
      source_component_id: "source_component_1",
      ftype: "simple_resistor",
      name: "R1",
      display_resistance: "1kΩ",
    },
    {
      type: "source_component",
      source_component_id: "source_component_2",
      ftype: "simple_resistor",
      name: "R2",
      display_resistance: "10kΩ",
    },
    {
      type: "source_port",
      source_port_id: "source_port_0",
      source_component_id: "source_component_0",
      name: "pin14",
      pin_number: 14,
      port_hints: ["pin14", "EFUSE_FAULT1"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_1",
      source_component_id: "source_component_0",
      name: "pin15",
      pin_number: 15,
      port_hints: ["pin15", "HOTSWAP_PG"],
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

  expect(netlist).toContain("NET: U1_EFUSE_FAULT1")
  expect(netlist).toContain("  - U1 pin14 (EFUSE_FAULT1)")
  expect(netlist).toContain("- pin14(EFUSE_FAULT1): NETS(U1_EFUSE_FAULT1)")
  expect(netlist).toContain("NET: U1_HOTSWAP_PG")
  expect(netlist).toContain("  - U1 pin15 (HOTSWAP_PG)")
  expect(netlist).toContain("- pin15(HOTSWAP_PG): NETS(U1_HOTSWAP_PG)")
})
