import { expect, it } from "bun:test"
import type { AnyCircuitElement } from "circuit-json"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"

it("preserves industrial fieldbus pin aliases in readable netlists", () => {
  const circuitJson: AnyCircuitElement[] = [
    {
      type: "source_component",
      source_component_id: "source_component_u1",
      ftype: "simple_chip",
      name: "U1",
      manufacturer_part_number: "MAX3485",
    },
    {
      type: "source_component",
      source_component_id: "source_component_r1",
      ftype: "simple_resistor",
      name: "R1",
      resistance: 1000,
      display_resistance: "1k",
    },
    {
      type: "source_component",
      source_component_id: "source_component_r2",
      ftype: "simple_resistor",
      name: "R2",
      resistance: 1000,
      display_resistance: "1k",
    },
    {
      type: "source_component",
      source_component_id: "source_component_r3",
      ftype: "simple_resistor",
      name: "R3",
      resistance: 1000,
      display_resistance: "1k",
    },
    {
      type: "source_port",
      source_port_id: "source_port_u1_13",
      source_component_id: "source_component_u1",
      name: "pin13",
      pin_number: 13,
      port_hints: ["pin13", "DMX_D+"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_u1_14",
      source_component_id: "source_component_u1",
      name: "pin14",
      pin_number: 14,
      port_hints: ["pin14", "RS485_A"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_u1_15",
      source_component_id: "source_component_u1",
      name: "pin15",
      pin_number: 15,
      port_hints: ["pin15", "DALI1"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_r1_1",
      source_component_id: "source_component_r1",
      name: "pin1",
      pin_number: 1,
      port_hints: ["anode", "pos", "left"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_r2_1",
      source_component_id: "source_component_r2",
      name: "pin1",
      pin_number: 1,
      port_hints: ["anode", "pos", "left"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_r3_1",
      source_component_id: "source_component_r3",
      name: "pin1",
      pin_number: 1,
      port_hints: ["anode", "pos", "left"],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_dmx",
      connected_source_port_ids: ["source_port_u1_13", "source_port_r1_1"],
      connected_source_net_ids: [],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_rs485",
      connected_source_port_ids: ["source_port_u1_14", "source_port_r2_1"],
      connected_source_net_ids: [],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_dali",
      connected_source_port_ids: ["source_port_u1_15", "source_port_r3_1"],
      connected_source_net_ids: [],
    },
  ] as AnyCircuitElement[]

  const readableNetlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(readableNetlist).toContain("NET: U1_DMX_D+")
  expect(readableNetlist).toContain("  - U1 pin13 (DMX_D+)")
  expect(readableNetlist).toContain("NET: U1_RS485_A")
  expect(readableNetlist).toContain("  - U1 pin14 (RS485_A)")
  expect(readableNetlist).toContain("NET: U1_DALI1")
  expect(readableNetlist).toContain("  - U1 pin15 (DALI1)")
})
