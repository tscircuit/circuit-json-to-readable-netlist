import { expect, it } from "bun:test"
import type { AnyCircuitElement } from "circuit-json"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"

declare module "bun:test" {
  interface Matchers<T = unknown> {
    toContain(expected: string): Promise<MatcherResult>
  }
}

it("keeps keyboard matrix row and column aliases in readable net names", () => {
  const circuitJson: AnyCircuitElement[] = [
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_keyboard_controller",
      name: "U1",
      manufacturer_part_number: "KB2040",
    },
    {
      type: "source_component",
      ftype: "simple_resistor",
      source_component_id: "source_component_row_pullup",
      name: "R1",
      resistance: 10000,
      display_resistance: "10k",
    },
    {
      type: "source_component",
      ftype: "simple_resistor",
      source_component_id: "source_component_col_pullup",
      name: "R2",
      resistance: 10000,
      display_resistance: "10k",
    },
    {
      type: "source_port",
      source_port_id: "source_port_u1_pin14",
      source_component_id: "source_component_keyboard_controller",
      pin_number: 14,
      name: "pin14",
      port_hints: ["KEY_ROW1"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_u1_pin15",
      source_component_id: "source_component_keyboard_controller",
      pin_number: 15,
      name: "pin15",
      port_hints: ["KEY_COL2"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_r1_pin1",
      source_component_id: "source_component_row_pullup",
      pin_number: 1,
      name: "pin1",
      port_hints: ["anode", "pos", "left"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_r2_pin1",
      source_component_id: "source_component_col_pullup",
      pin_number: 1,
      name: "pin1",
      port_hints: ["anode", "pos", "left"],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_row",
      connected_source_port_ids: [
        "source_port_u1_pin14",
        "source_port_r1_pin1",
      ],
      connected_source_net_ids: [],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_col",
      connected_source_port_ids: [
        "source_port_u1_pin15",
        "source_port_r2_pin1",
      ],
      connected_source_net_ids: [],
    },
  ]

  const readableNetlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(readableNetlist).toContain("NET: U1_KEY_ROW1")
  expect(readableNetlist).toContain("  - U1 pin14 (KEY_ROW1)")
  expect(readableNetlist).toContain("NET: U1_KEY_COL2")
  expect(readableNetlist).toContain("  - U1 pin15 (KEY_COL2)")
})
