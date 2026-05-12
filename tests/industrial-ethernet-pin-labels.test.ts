import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"

it("preserves industrial ethernet fieldbus aliases in readable netlists", () => {
  const circuitJson: any[] = [
    {
      type: "source_component",
      source_component_id: "sc_u1",
      name: "U1",
      ftype: "simple_chip",
      manufacturer_part_number: "IND-ETH",
    },
    {
      type: "source_component",
      source_component_id: "sc_r1",
      name: "R1",
      ftype: "simple_resistor",
      display_resistance: "49.9",
    },
    {
      type: "source_component",
      source_component_id: "sc_r2",
      name: "R2",
      ftype: "simple_resistor",
      display_resistance: "49.9",
    },
    {
      type: "cad_component",
      cad_component_id: "cad_u1",
      source_component_id: "sc_u1",
      footprinter_string: "qfn32",
    },
    {
      type: "cad_component",
      cad_component_id: "cad_r1",
      source_component_id: "sc_r1",
      footprinter_string: "0402",
    },
    {
      type: "cad_component",
      cad_component_id: "cad_r2",
      source_component_id: "sc_r2",
      footprinter_string: "0402",
    },
    {
      type: "source_port",
      source_port_id: "source_port_u1_14",
      source_component_id: "sc_u1",
      name: "pin14",
      pin_number: 14,
      port_hints: ["ETHERCAT_TX1"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_u1_15",
      source_component_id: "sc_u1",
      name: "pin15",
      pin_number: 15,
      port_hints: ["PROFINET_RX1"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_r1_1",
      source_component_id: "sc_r1",
      name: "pin1",
      pin_number: 1,
      port_hints: ["anode", "pos", "left"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_r2_1",
      source_component_id: "sc_r2",
      name: "pin1",
      pin_number: 1,
      port_hints: ["anode", "pos", "left"],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_ethercat",
      connected_source_port_ids: ["source_port_u1_14", "source_port_r1_1"],
      connected_source_net_ids: [],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_profinet",
      connected_source_port_ids: ["source_port_u1_15", "source_port_r2_1"],
      connected_source_net_ids: [],
    },
  ]

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_ETHERCAT_TX1")
  expect(netlist).toContain("  - U1 pin14 (ETHERCAT_TX1)")
  expect(netlist).toContain("- pin14(ETHERCAT_TX1): NETS(U1_ETHERCAT_TX1)")
  expect(netlist).toContain("NET: U1_PROFINET_RX1")
  expect(netlist).toContain("  - U1 pin15 (PROFINET_RX1)")
  expect(netlist).toContain("- pin15(PROFINET_RX1): NETS(U1_PROFINET_RX1)")
  expect(netlist).not.toContain("NET: R1_pos")
  expect(netlist).not.toContain("NET: R2_pos")
})
