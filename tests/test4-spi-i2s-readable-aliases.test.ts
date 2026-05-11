import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"

it("keeps SPI chip-select and I2S clock hints in readable NET entries", () => {
  const circuitJson: any[] = [
    {
      type: "source_port",
      source_port_id: "source_port_u1_1",
      name: "pin1",
      pin_number: 1,
      port_hints: ["NSS", "pin1", "1"],
      source_component_id: "source_component_u1",
    },
    {
      type: "source_port",
      source_port_id: "source_port_u1_2",
      name: "pin2",
      pin_number: 2,
      port_hints: ["CS", "pin2", "2"],
      source_component_id: "source_component_u1",
    },
    {
      type: "source_port",
      source_port_id: "source_port_u1_3",
      name: "pin3",
      pin_number: 3,
      port_hints: ["BCLK", "pin3", "3"],
      source_component_id: "source_component_u1",
    },
    {
      type: "source_port",
      source_port_id: "source_port_u1_4",
      name: "pin4",
      pin_number: 4,
      port_hints: ["LRCLK", "pin4", "4"],
      source_component_id: "source_component_u1",
    },
    {
      type: "source_component",
      source_component_id: "source_component_u1",
      ftype: "simple_chip",
      name: "U1",
      manufacturer_part_number: "MCU",
    },
    {
      type: "source_port",
      source_port_id: "source_port_u2_1",
      name: "pin1",
      pin_number: 1,
      port_hints: ["NSS", "pin1", "1"],
      source_component_id: "source_component_u2",
    },
    {
      type: "source_port",
      source_port_id: "source_port_u2_2",
      name: "pin2",
      pin_number: 2,
      port_hints: ["CS", "pin2", "2"],
      source_component_id: "source_component_u2",
    },
    {
      type: "source_port",
      source_port_id: "source_port_u2_3",
      name: "pin3",
      pin_number: 3,
      port_hints: ["BCLK", "pin3", "3"],
      source_component_id: "source_component_u2",
    },
    {
      type: "source_port",
      source_port_id: "source_port_u2_4",
      name: "pin4",
      pin_number: 4,
      port_hints: ["LRCLK", "pin4", "4"],
      source_component_id: "source_component_u2",
    },
    {
      type: "source_component",
      source_component_id: "source_component_u2",
      ftype: "simple_chip",
      name: "U2",
      manufacturer_part_number: "AUDIO",
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_0",
      connected_source_port_ids: ["source_port_u1_1", "source_port_u2_1"],
      connected_source_net_ids: [],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_1",
      connected_source_port_ids: ["source_port_u1_2", "source_port_u2_2"],
      connected_source_net_ids: [],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_2",
      connected_source_port_ids: ["source_port_u1_3", "source_port_u2_3"],
      connected_source_net_ids: [],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_3",
      connected_source_port_ids: ["source_port_u1_4", "source_port_u2_4"],
      connected_source_net_ids: [],
    },
  ]

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_NSS\n  - U1 pin1 (NSS)\n  - U2 pin1 (NSS)")
  expect(netlist).toContain("NET: U1_CS\n  - U1 pin2 (CS)\n  - U2 pin2 (CS)")
  expect(netlist).toContain(
    "NET: U1_BCLK\n  - U1 pin3 (BCLK)\n  - U2 pin3 (BCLK)",
  )
  expect(netlist).toContain(
    "NET: U1_LRCLK\n  - U1 pin4 (LRCLK)\n  - U2 pin4 (LRCLK)",
  )
})
