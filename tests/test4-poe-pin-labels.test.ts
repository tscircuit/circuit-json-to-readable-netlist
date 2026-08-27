import { expect, it } from "bun:test"
import type { AnyCircuitElement } from "circuit-json"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"

it("preserves PoE power-interface aliases on generic pin labels", () => {
  const circuitJson: AnyCircuitElement[] = [
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_poe_pd",
      name: "U1",
      manufacturer_part_number: "TPS2378",
    },
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_rj45",
      name: "J1",
      manufacturer_part_number: "RJ45-POE",
    },
    {
      type: "source_port",
      source_port_id: "source_port_u1_vportp",
      source_component_id: "source_component_poe_pd",
      name: "pin14",
      pin_number: 14,
      port_hints: ["pin14", "POE_VPORTP"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_j1_vportp",
      source_component_id: "source_component_rj45",
      name: "pin1",
      pin_number: 1,
      port_hints: ["pin1", "POE_VPORTP"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_u1_class",
      source_component_id: "source_component_poe_pd",
      name: "pin15",
      pin_number: 15,
      port_hints: ["pin15", "PSE_CLASS0"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_j1_class",
      source_component_id: "source_component_rj45",
      name: "pin2",
      pin_number: 2,
      port_hints: ["pin2", "PSE_CLASS0"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_u1_rdet",
      source_component_id: "source_component_poe_pd",
      name: "pin16",
      pin_number: 16,
      port_hints: ["pin16", "RDET1"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_j1_rdet",
      source_component_id: "source_component_rj45",
      name: "pin3",
      pin_number: 3,
      port_hints: ["pin3", "RDET1"],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_vportp",
      connected_source_port_ids: [
        "source_port_u1_vportp",
        "source_port_j1_vportp",
      ],
      connected_source_net_ids: [],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_class",
      connected_source_port_ids: [
        "source_port_u1_class",
        "source_port_j1_class",
      ],
      connected_source_net_ids: [],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_rdet",
      connected_source_port_ids: ["source_port_u1_rdet", "source_port_j1_rdet"],
      connected_source_net_ids: [],
    },
  ]

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_POE_VPORTP")
  expect(netlist).toContain("  - U1 pin14 (POE_VPORTP)")
  expect(netlist).toContain("  - J1 pin1 (POE_VPORTP)")
  expect(netlist).toContain("NET: U1_PSE_CLASS0")
  expect(netlist).toContain("  - U1 pin15 (PSE_CLASS0)")
  expect(netlist).toContain("  - J1 pin2 (PSE_CLASS0)")
  expect(netlist).toContain("NET: U1_RDET1")
  expect(netlist).toContain("  - U1 pin16 (RDET1)")
  expect(netlist).toContain("  - J1 pin3 (RDET1)")
})
