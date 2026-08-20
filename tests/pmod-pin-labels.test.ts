import { expect, it } from "bun:test"
import type { AnyCircuitElement } from "circuit-json"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"

it("preserves PMOD expansion header aliases in readable net names and pins", () => {
  const circuitJson: AnyCircuitElement[] = [
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_0",
      name: "U1",
      manufacturer_part_number: "PMOD_HOST",
    },
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_1",
      name: "J1",
      manufacturer_part_number: "PMOD_DEVICE",
    },
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_2",
      name: "J2",
      manufacturer_part_number: "PMOD_DEVICE",
    },
    {
      type: "source_port",
      source_port_id: "source_port_0",
      source_component_id: "source_component_0",
      name: "pin14",
      pin_number: 14,
      port_hints: ["PMOD_JA1"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_1",
      source_component_id: "source_component_1",
      name: "pin1",
      pin_number: 1,
      port_hints: ["pos"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_2",
      source_component_id: "source_component_0",
      name: "pin15",
      pin_number: 15,
      port_hints: ["PMOD_INT"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_3",
      source_component_id: "source_component_2",
      name: "pin1",
      pin_number: 1,
      port_hints: ["pos"],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_0",
      connected_source_port_ids: ["source_port_0", "source_port_1"],
      connected_source_net_ids: [],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_1",
      connected_source_port_ids: ["source_port_2", "source_port_3"],
      connected_source_net_ids: [],
    },
  ]

  const readableNetlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(readableNetlist).toContain("NET: U1_PMOD_JA1")
  expect(readableNetlist).toContain("NET: U1_PMOD_INT")
  expect(readableNetlist).toContain("  - U1 pin14 (PMOD_JA1)")
  expect(readableNetlist).toContain("  - U1 pin15 (PMOD_INT)")
  expect(readableNetlist).not.toContain("undefined")
})
