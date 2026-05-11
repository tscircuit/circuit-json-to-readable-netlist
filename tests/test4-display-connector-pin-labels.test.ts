import { expect, it } from "bun:test"
import type { AnyCircuitElement } from "circuit-json"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"

it("preserves display connector aliases on generic pin labels", () => {
  const circuitJson: AnyCircuitElement[] = [
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_video_bridge",
      name: "U1",
      manufacturer_part_number: "LT9611UXC",
    },
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_hdmi_connector",
      name: "J1",
      manufacturer_part_number: "HDMI_CONN",
    },
    {
      type: "source_port",
      source_port_id: "source_port_u1_hpd",
      source_component_id: "source_component_video_bridge",
      name: "pin14",
      pin_number: 14,
      port_hints: ["pin14", "HPD"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_j1_hpd",
      source_component_id: "source_component_hdmi_connector",
      name: "pin19",
      pin_number: 19,
      port_hints: ["pin19", "HPD"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_u1_cec",
      source_component_id: "source_component_video_bridge",
      name: "pin15",
      pin_number: 15,
      port_hints: ["pin15", "CEC"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_j1_cec",
      source_component_id: "source_component_hdmi_connector",
      name: "pin13",
      pin_number: 13,
      port_hints: ["pin13", "CEC"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_u1_tmds_clk",
      source_component_id: "source_component_video_bridge",
      name: "pin16",
      pin_number: 16,
      port_hints: ["pin16", "TMDS_CLK_P"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_j1_tmds_clk",
      source_component_id: "source_component_hdmi_connector",
      name: "pin10",
      pin_number: 10,
      port_hints: ["pin10", "TMDS_CLK_P"],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_hpd",
      connected_source_port_ids: ["source_port_u1_hpd", "source_port_j1_hpd"],
      connected_source_net_ids: [],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_cec",
      connected_source_port_ids: ["source_port_u1_cec", "source_port_j1_cec"],
      connected_source_net_ids: [],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_tmds_clk",
      connected_source_port_ids: [
        "source_port_u1_tmds_clk",
        "source_port_j1_tmds_clk",
      ],
      connected_source_net_ids: [],
    },
  ]

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_HPD")
  expect(netlist).toContain("  - U1 pin14 (HPD)")
  expect(netlist).toContain("  - J1 pin19 (HPD)")
  expect(netlist).toContain("NET: U1_CEC")
  expect(netlist).toContain("  - U1 pin15 (CEC)")
  expect(netlist).toContain("  - J1 pin13 (CEC)")
  expect(netlist).toContain("NET: U1_TMDS_CLK_P")
  expect(netlist).toContain("  - U1 pin16 (TMDS_CLK_P)")
  expect(netlist).toContain("  - J1 pin10 (TMDS_CLK_P)")
})
