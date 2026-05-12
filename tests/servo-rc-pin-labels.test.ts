import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"

it("preserves servo and RC receiver aliases on generic chip pins", () => {
  const circuitJson = [
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_0",
      name: "U1",
      manufacturer_part_number: "RC_MCU",
    },
    {
      type: "source_component",
      ftype: "simple_resistor",
      source_component_id: "source_component_1",
      name: "R1",
      display_resistance: "1k",
    },
    {
      type: "source_component",
      ftype: "simple_resistor",
      source_component_id: "source_component_2",
      name: "R2",
      display_resistance: "1k",
    },
    {
      type: "source_component",
      ftype: "simple_resistor",
      source_component_id: "source_component_3",
      name: "R3",
      display_resistance: "1k",
    },
    {
      type: "source_component",
      ftype: "simple_resistor",
      source_component_id: "source_component_4",
      name: "R4",
      display_resistance: "1k",
    },
    {
      type: "source_port",
      source_port_id: "source_port_0",
      source_component_id: "source_component_0",
      pin_number: 14,
      name: "pin14",
      port_hints: ["SERVO_PWM1"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_1",
      source_component_id: "source_component_0",
      pin_number: 15,
      name: "pin15",
      port_hints: ["SBUS_RX1"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_2",
      source_component_id: "source_component_0",
      pin_number: 16,
      name: "pin16",
      port_hints: ["CRSF_TX1"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_3",
      source_component_id: "source_component_0",
      pin_number: 17,
      name: "pin17",
      port_hints: ["PPM_IN"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_4",
      source_component_id: "source_component_1",
      pin_number: 1,
      name: "pin1",
      port_hints: ["anode", "pos", "left"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_5",
      source_component_id: "source_component_2",
      pin_number: 1,
      name: "pin1",
      port_hints: ["anode", "pos", "left"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_6",
      source_component_id: "source_component_3",
      pin_number: 1,
      name: "pin1",
      port_hints: ["anode", "pos", "left"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_7",
      source_component_id: "source_component_4",
      pin_number: 1,
      name: "pin1",
      port_hints: ["anode", "pos", "left"],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_0",
      connected_source_port_ids: ["source_port_0", "source_port_4"],
      connected_source_net_ids: [],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_1",
      connected_source_port_ids: ["source_port_1", "source_port_5"],
      connected_source_net_ids: [],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_2",
      connected_source_port_ids: ["source_port_2", "source_port_6"],
      connected_source_net_ids: [],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_3",
      connected_source_port_ids: ["source_port_3", "source_port_7"],
      connected_source_net_ids: [],
    },
  ] as any

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_SERVO_PWM1")
  expect(netlist).toContain("  - U1 pin14 (SERVO_PWM1)")
  expect(netlist).toContain("NET: U1_SBUS_RX1")
  expect(netlist).toContain("  - U1 pin15 (SBUS_RX1)")
  expect(netlist).toContain("NET: U1_CRSF_TX1")
  expect(netlist).toContain("  - U1 pin16 (CRSF_TX1)")
  expect(netlist).toContain("NET: U1_PPM_IN")
  expect(netlist).toContain("  - U1 pin17 (PPM_IN)")
})
