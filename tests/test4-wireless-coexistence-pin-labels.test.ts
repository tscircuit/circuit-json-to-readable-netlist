import { expect, it } from "bun:test"
import type { CircuitJson } from "circuit-json"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"

it("preserves wireless coexistence pin labels in net entries", () => {
  const circuitJson: CircuitJson = [
    {
      type: "source_component",
      source_component_id: "chip1",
      ftype: "simple_chip",
      name: "U1",
      manufacturer_part_number: "CYW43439",
    },
    {
      type: "source_component",
      source_component_id: "r1",
      ftype: "simple_resistor",
      name: "R1",
      resistance: 10_000,
      display_resistance: "10k",
    },
    {
      type: "source_component",
      source_component_id: "r2",
      ftype: "simple_resistor",
      name: "R2",
      resistance: 10_000,
      display_resistance: "10k",
    },
    {
      type: "source_port",
      source_port_id: "source_port_u1_pin14",
      source_component_id: "chip1",
      name: "pin14",
      pin_number: 14,
      port_hints: ["BT_HOST_WAKE"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_u1_pin15",
      source_component_id: "chip1",
      name: "pin15",
      pin_number: 15,
      port_hints: ["WLAN_IRQ0"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_r1_pin1",
      source_component_id: "r1",
      name: "pin1",
      pin_number: 1,
      port_hints: ["pos", "anode", "left"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_r2_pin1",
      source_component_id: "r2",
      name: "pin1",
      pin_number: 1,
      port_hints: ["pos", "anode", "left"],
    },
    {
      type: "source_trace",
      source_trace_id: "trace1",
      connected_source_port_ids: [
        "source_port_u1_pin14",
        "source_port_r1_pin1",
      ],
      connected_source_net_ids: [],
    },
    {
      type: "source_trace",
      source_trace_id: "trace2",
      connected_source_port_ids: [
        "source_port_u1_pin15",
        "source_port_r2_pin1",
      ],
      connected_source_net_ids: [],
    },
  ]

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_BT_HOST_WAKE")
  expect(netlist).toContain("  - U1 pin14 (BT_HOST_WAKE)")
  expect(netlist).toContain("NET: U1_WLAN_IRQ0")
  expect(netlist).toContain("  - U1 pin15 (WLAN_IRQ0)")
})
