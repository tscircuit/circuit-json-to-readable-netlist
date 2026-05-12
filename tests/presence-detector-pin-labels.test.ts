import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"

it("preserves PIR and presence detector pin aliases", () => {
  const circuitJson = [
    {
      type: "source_component",
      source_component_id: "source_component_u1",
      ftype: "simple_chip",
      name: "U1",
      manufacturer_part_number: "PIR-PRESENCE-DETECTOR",
    },
    {
      type: "source_component",
      source_component_id: "source_component_u2",
      ftype: "simple_chip",
      name: "U2",
      manufacturer_part_number: "RP2040",
    },
    {
      type: "source_port",
      source_port_id: "source_port_u1_14",
      source_component_id: "source_component_u1",
      name: "pin14",
      pin_number: 14,
      port_hints: ["PIR1_OUT", "pos"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_u1_15",
      source_component_id: "source_component_u1",
      name: "pin15",
      pin_number: 15,
      port_hints: ["MOTION_DET"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_u1_16",
      source_component_id: "source_component_u1",
      name: "pin16",
      pin_number: 16,
      port_hints: ["OCC_INT"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_u2_1",
      source_component_id: "source_component_u2",
      name: "pin1",
      pin_number: 1,
      port_hints: ["GPIO1"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_u2_2",
      source_component_id: "source_component_u2",
      name: "pin2",
      pin_number: 2,
      port_hints: ["GPIO2"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_u2_3",
      source_component_id: "source_component_u2",
      name: "pin3",
      pin_number: 3,
      port_hints: ["GPIO3"],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_pir",
      connected_source_port_ids: ["source_port_u1_14", "source_port_u2_1"],
      connected_source_net_ids: [],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_motion",
      connected_source_port_ids: ["source_port_u1_15", "source_port_u2_2"],
      connected_source_net_ids: [],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_occupancy",
      connected_source_port_ids: ["source_port_u1_16", "source_port_u2_3"],
      connected_source_net_ids: [],
    },
  ] as any

  const readableNetlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(readableNetlist).toContain("NET: U1_PIR1_OUT")
  expect(readableNetlist).toContain("NET: U1_MOTION_DET")
  expect(readableNetlist).toContain("NET: U1_OCC_INT")
  expect(readableNetlist).toContain("  - U1 pin14 (+,PIR1_OUT)")
  expect(readableNetlist).toContain("  - U1 pin15 (MOTION_DET)")
  expect(readableNetlist).toContain("  - U1 pin16 (OCC_INT)")
})
