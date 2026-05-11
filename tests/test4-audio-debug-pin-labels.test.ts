import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"

it("keeps audio and debug bus aliases for generic chip pins", () => {
  const circuitJson = [
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_u1",
      name: "U1",
      manufacturer_part_number: "MCU",
    },
    {
      type: "source_component",
      ftype: "simple_resistor",
      source_component_id: "source_component_r1",
      name: "R1",
      display_resistance: "1k",
    },
    {
      type: "source_component",
      ftype: "simple_resistor",
      source_component_id: "source_component_r2",
      name: "R2",
      display_resistance: "10k",
    },
    {
      type: "cad_component",
      cad_component_id: "cad_component_r1",
      source_component_id: "source_component_r1",
      footprinter_string: "0402",
    },
    {
      type: "cad_component",
      cad_component_id: "cad_component_r2",
      source_component_id: "source_component_r2",
      footprinter_string: "0402",
    },
    {
      type: "source_port",
      source_port_id: "source_port_u1_14",
      source_component_id: "source_component_u1",
      name: "pin14",
      pin_number: 14,
      port_hints: ["pin14", "I2S_BCLK"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_u1_15",
      source_component_id: "source_component_u1",
      name: "pin15",
      pin_number: 15,
      port_hints: ["pin15", "SWDIO"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_r1_1",
      source_component_id: "source_component_r1",
      name: "pin1",
      pin_number: 1,
      port_hints: ["pos"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_r2_1",
      source_component_id: "source_component_r2",
      name: "pin1",
      pin_number: 1,
      port_hints: ["pos"],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_audio",
      connected_source_port_ids: ["source_port_u1_14", "source_port_r1_1"],
      connected_source_net_ids: [],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_debug",
      connected_source_port_ids: ["source_port_u1_15", "source_port_r2_1"],
      connected_source_net_ids: [],
    },
  ] as any

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_I2S_BCLK")
  expect(netlist).toContain("  - U1 pin14 (I2S_BCLK)")
  expect(netlist).toContain("- pin14(I2S_BCLK): NETS(U1_I2S_BCLK)")
  expect(netlist).not.toContain("NET: R1_pos")
  expect(netlist).toContain("NET: U1_SWDIO")
  expect(netlist).toContain("  - U1 pin15 (SWDIO)")
  expect(netlist).toContain("- pin15(SWDIO): NETS(U1_SWDIO)")
})
