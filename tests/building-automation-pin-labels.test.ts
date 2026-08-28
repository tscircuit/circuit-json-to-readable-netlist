import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "../lib"

it("preserves building automation bus pin labels", () => {
  const circuitJson: any[] = [
    {
      type: "source_component",
      source_component_id: "source_component_1",
      name: "U1",
      ftype: "simple_chip",
    },
    {
      type: "source_component",
      source_component_id: "source_component_2",
      name: "R1",
      ftype: "simple_resistor",
      resistance: 1000,
      display_resistance: "1kohm",
    },
    {
      type: "source_component",
      source_component_id: "source_component_3",
      name: "R2",
      ftype: "simple_resistor",
      resistance: 1000,
      display_resistance: "1kohm",
    },
    {
      type: "source_component",
      source_component_id: "source_component_4",
      name: "R3",
      ftype: "simple_resistor",
      resistance: 1000,
      display_resistance: "1kohm",
    },
    {
      type: "source_component",
      source_component_id: "source_component_5",
      name: "R4",
      ftype: "simple_resistor",
      resistance: 1000,
      display_resistance: "1kohm",
    },
    {
      type: "source_port",
      source_port_id: "source_port_1",
      source_component_id: "source_component_1",
      pin_number: 14,
      port_hints: ["KNX_TP1"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_2",
      source_component_id: "source_component_1",
      pin_number: 15,
      port_hints: ["BACNET_MSTP_A"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_3",
      source_component_id: "source_component_1",
      pin_number: 16,
      port_hints: ["MBUS_DATA1"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_4",
      source_component_id: "source_component_1",
      pin_number: 17,
      port_hints: ["LONWORKS_NET_A"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_5",
      source_component_id: "source_component_2",
      pin_number: 1,
      name: "pos",
      port_hints: ["pos", "anode", "left"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_6",
      source_component_id: "source_component_3",
      pin_number: 1,
      name: "pos",
      port_hints: ["pos", "anode", "left"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_7",
      source_component_id: "source_component_4",
      pin_number: 1,
      name: "pos",
      port_hints: ["pos", "anode", "left"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_8",
      source_component_id: "source_component_5",
      pin_number: 1,
      name: "pos",
      port_hints: ["pos", "anode", "left"],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_1",
      connected_source_port_ids: ["source_port_1", "source_port_5"],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_2",
      connected_source_port_ids: ["source_port_2", "source_port_6"],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_3",
      connected_source_port_ids: ["source_port_3", "source_port_7"],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_4",
      connected_source_port_ids: ["source_port_4", "source_port_8"],
    },
  ]

  const readableNetlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(readableNetlist).toContain("NET: U1_KNX_TP1")
  expect(readableNetlist).toContain("NET: U1_BACNET_MSTP_A")
  expect(readableNetlist).toContain("NET: U1_MBUS_DATA1")
  expect(readableNetlist).toContain("NET: U1_LONWORKS_NET_A")
  expect(readableNetlist).toContain("- U1 Pin14 (KNX_TP1)")
  expect(readableNetlist).toContain("- U1 Pin15 (BACNET_MSTP_A)")
  expect(readableNetlist).toContain("- U1 Pin16 (MBUS_DATA1)")
  expect(readableNetlist).toContain("- U1 Pin17 (LONWORKS_NET_A)")
  expect(readableNetlist).toContain("- pin14(KNX_TP1): NETS(U1_KNX_TP1)")
  expect(readableNetlist).toContain(
    "- pin15(BACNET_MSTP_A): NETS(U1_BACNET_MSTP_A)",
  )
  expect(readableNetlist).toContain("- pin16(MBUS_DATA1): NETS(U1_MBUS_DATA1)")
  expect(readableNetlist).toContain(
    "- pin17(LONWORKS_NET_A): NETS(U1_LONWORKS_NET_A)",
  )
})
