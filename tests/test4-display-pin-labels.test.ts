import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"

it("keeps HDMI and DisplayPort aliases above generic pin labels", () => {
  const circuitJson = [
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_u1",
      name: "U1",
      manufacturer_part_number: "DISPLAY_BRIDGE",
    },
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_j1",
      name: "J1",
      manufacturer_part_number: "DISPLAY_CONN",
    },
    {
      type: "source_port",
      source_port_id: "source_port_u1_aux_p",
      source_component_id: "source_component_u1",
      name: "pin14",
      pin_number: 14,
      port_hints: ["DP_AUX_P"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_u1_aux_n",
      source_component_id: "source_component_u1",
      name: "pin15",
      pin_number: 15,
      port_hints: ["DP_AUX_N"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_u1_hpd",
      source_component_id: "source_component_u1",
      name: "pin16",
      pin_number: 16,
      port_hints: ["HDMI_HPD"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_u1_tmds",
      source_component_id: "source_component_u1",
      name: "pin17",
      pin_number: 17,
      port_hints: ["TMDS_D0P"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_u1_cec",
      source_component_id: "source_component_u1",
      name: "pin18",
      pin_number: 18,
      port_hints: ["HDMI_CEC"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_j1_aux_p",
      source_component_id: "source_component_j1",
      name: "pin1",
      pin_number: 1,
      port_hints: ["AUX_P"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_j1_aux_n",
      source_component_id: "source_component_j1",
      name: "pin2",
      pin_number: 2,
      port_hints: ["AUX_N"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_j1_hpd",
      source_component_id: "source_component_j1",
      name: "pin3",
      pin_number: 3,
      port_hints: ["HPD"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_j1_tmds",
      source_component_id: "source_component_j1",
      name: "pin4",
      pin_number: 4,
      port_hints: ["TMDS_D0P"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_j1_cec",
      source_component_id: "source_component_j1",
      name: "pin5",
      pin_number: 5,
      port_hints: ["CEC"],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_aux_p",
      connected_source_port_ids: [
        "source_port_u1_aux_p",
        "source_port_j1_aux_p",
      ],
      connected_source_net_ids: [],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_aux_n",
      connected_source_port_ids: [
        "source_port_u1_aux_n",
        "source_port_j1_aux_n",
      ],
      connected_source_net_ids: [],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_hpd",
      connected_source_port_ids: ["source_port_u1_hpd", "source_port_j1_hpd"],
      connected_source_net_ids: [],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_tmds",
      connected_source_port_ids: ["source_port_u1_tmds", "source_port_j1_tmds"],
      connected_source_net_ids: [],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_cec",
      connected_source_port_ids: ["source_port_u1_cec", "source_port_j1_cec"],
      connected_source_net_ids: [],
    },
  ]

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson as any)

  expect(netlist).toContain("NET: U1_DP_AUX_P")
  expect(netlist).toContain("  - U1 pin14 (DP_AUX_P)")
  expect(netlist).toContain("  - J1 pin1 (AUX_P)")
  expect(netlist).toContain("- pin14(DP_AUX_P): NETS(U1_DP_AUX_P)")

  expect(netlist).toContain("NET: U1_DP_AUX_N")
  expect(netlist).toContain("  - U1 pin15 (DP_AUX_N)")
  expect(netlist).toContain("  - J1 pin2 (AUX_N)")

  expect(netlist).toContain("NET: U1_HDMI_HPD")
  expect(netlist).toContain("  - U1 pin16 (HDMI_HPD)")
  expect(netlist).toContain("  - J1 pin3 (HPD)")

  expect(netlist).toContain("NET: U1_TMDS_D0P")
  expect(netlist).toContain("  - U1 pin17 (TMDS_D0P)")

  expect(netlist).toContain("NET: U1_HDMI_CEC")
  expect(netlist).toContain("  - U1 pin18 (HDMI_CEC)")
  expect(netlist).toContain("  - J1 pin5 (CEC)")
})
