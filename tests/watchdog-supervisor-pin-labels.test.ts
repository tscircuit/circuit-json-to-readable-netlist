import { expect, it } from "bun:test"
import type { AnyCircuitElement } from "circuit-json"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"

it("preserves watchdog and supervisor pin labels on generic chip pins", () => {
  const circuitJson: AnyCircuitElement[] = [
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_1",
      name: "U1",
      manufacturer_part_number: "TPS386000",
    },
    {
      type: "source_component",
      ftype: "simple_resistor",
      source_component_id: "source_component_2",
      name: "R1",
      resistance: 10_000,
      display_resistance: "10k",
    },
    {
      type: "source_component",
      ftype: "simple_resistor",
      source_component_id: "source_component_3",
      name: "R2",
      resistance: 10_000,
      display_resistance: "10k",
    },
    {
      type: "cad_component",
      cad_component_id: "cad_component_1",
      pcb_component_id: "pcb_component_1",
      source_component_id: "source_component_2",
      footprinter_string: "0402",
      position: { x: 0, y: 0, z: 0 },
    },
    {
      type: "cad_component",
      cad_component_id: "cad_component_2",
      pcb_component_id: "pcb_component_2",
      source_component_id: "source_component_3",
      footprinter_string: "0402",
      position: { x: 0, y: 0, z: 0 },
    },
    {
      type: "source_port",
      source_port_id: "source_port_1",
      source_component_id: "source_component_1",
      name: "pin14",
      pin_number: 14,
      port_hints: ["WDI1", "WATCHDOG_IN1"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_2",
      source_component_id: "source_component_1",
      name: "pin15",
      pin_number: 15,
      port_hints: ["UVLO1"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_3",
      source_component_id: "source_component_2",
      name: "pin1",
      pin_number: 1,
      port_hints: ["pos", "anode"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_4",
      source_component_id: "source_component_3",
      name: "pin1",
      pin_number: 1,
      port_hints: ["pos", "anode"],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_1",
      connected_source_port_ids: ["source_port_1", "source_port_3"],
      connected_source_net_ids: [],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_2",
      connected_source_port_ids: ["source_port_2", "source_port_4"],
      connected_source_net_ids: [],
    },
  ]

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_WATCHDOG_IN1")
  expect(netlist).toContain("  - U1 pin14 (WDI1,WATCHDOG_IN1)")
  expect(netlist).toContain("NET: U1_UVLO1")
  expect(netlist).toContain("  - U1 pin15 (UVLO1)")
  expect(netlist).not.toContain("NET: R1_pos")
  expect(netlist).not.toContain("NET: R2_pos")
})
