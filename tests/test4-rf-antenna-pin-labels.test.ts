import { expect, it } from "bun:test"
import type { AnyCircuitElement } from "circuit-json"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"

it("preserves RF and antenna aliases on generic pin labels", () => {
  const circuitJson: AnyCircuitElement[] = [
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_radio",
      name: "U1",
      manufacturer_part_number: "BG95-M3",
    },
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_connector",
      name: "J1",
      manufacturer_part_number: "UFL_CONN",
    },
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_gnss_module",
      name: "U2",
      manufacturer_part_number: "MAX-M10S",
    },
    {
      type: "source_port",
      source_port_id: "source_port_u1_rf_in",
      source_component_id: "source_component_radio",
      name: "pin14",
      pin_number: 14,
      port_hints: ["pin14", "RF_IN"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_j1_rf_in",
      source_component_id: "source_component_connector",
      name: "pin1",
      pin_number: 1,
      port_hints: ["pin1", "ANT"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_u2_gnss",
      source_component_id: "source_component_gnss_module",
      name: "pin8",
      pin_number: 8,
      port_hints: ["pin8", "GNSS"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_j1_gnss",
      source_component_id: "source_component_connector",
      name: "pin2",
      pin_number: 2,
      port_hints: ["pin2", "ANTENNA"],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_rf_in",
      connected_source_port_ids: [
        "source_port_u1_rf_in",
        "source_port_j1_rf_in",
      ],
      connected_source_net_ids: [],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_gnss",
      connected_source_port_ids: ["source_port_u2_gnss", "source_port_j1_gnss"],
      connected_source_net_ids: [],
    },
  ]

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_RF_IN")
  expect(netlist).toContain("  - U1 pin14 (RF_IN)")
  expect(netlist).toContain("  - J1 pin1 (ANT)")
  expect(netlist).toContain("NET: U2_GNSS")
  expect(netlist).toContain("  - U2 pin8 (GNSS)")
  expect(netlist).toContain("  - J1 pin2 (ANTENNA)")
})
