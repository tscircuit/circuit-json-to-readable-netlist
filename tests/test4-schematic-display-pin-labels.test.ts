import { expect, it } from "bun:test"
import type { AnyCircuitElement } from "circuit-json"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"

it("uses schematic display pin labels when source port names are generic", () => {
  const circuitJson: AnyCircuitElement[] = [
    {
      type: "source_component",
      source_component_id: "sc_u1",
      name: "U1",
      ftype: "simple_chip",
    },
    {
      type: "source_component",
      source_component_id: "sc_r1",
      name: "R1",
      ftype: "simple_resistor",
      display_resistance: "10k",
    },
    {
      type: "source_port",
      source_port_id: "source_port_u1_14",
      source_component_id: "sc_u1",
      name: "pin14",
      pin_number: 14,
      port_hints: [],
    },
    {
      type: "schematic_port",
      schematic_port_id: "schematic_port_u1_14",
      source_port_id: "source_port_u1_14",
      display_pin_label: "RESET",
      center: { x: 0, y: 0 },
    },
    {
      type: "source_port",
      source_port_id: "source_port_r1_1",
      source_component_id: "sc_r1",
      name: "pin1",
      pin_number: 1,
      port_hints: ["pos"],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_1",
      connected_source_port_ids: ["source_port_u1_14", "source_port_r1_1"],
      connected_source_net_ids: [],
    },
  ] as AnyCircuitElement[]

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_RESET")
  expect(netlist).toContain("  - U1 pin14 (RESET)")
  expect(netlist).toContain("- pin14(RESET): NETS(U1_RESET)")
  expect(netlist).not.toContain("NET: R1_pos")
})
