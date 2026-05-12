import { expect, it } from "bun:test"
import type { AnyCircuitElement } from "circuit-json"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"

declare module "bun:test" {
  interface Matchers<T = unknown> {
    toContain(expected: string): Promise<MatcherResult>
  }
}

it("keeps load-cell and HX711 aliases in readable net names", () => {
  const circuitJson: AnyCircuitElement[] = [
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_adc",
      name: "U1",
      manufacturer_part_number: "HX711",
    },
    {
      type: "source_component",
      ftype: "simple_resistor",
      source_component_id: "source_component_dout_pullup",
      name: "R1",
      resistance: 10000,
      display_resistance: "10k",
    },
    {
      type: "source_component",
      ftype: "simple_resistor",
      source_component_id: "source_component_exc_pullup",
      name: "R2",
      resistance: 10000,
      display_resistance: "10k",
    },
    {
      type: "source_port",
      source_port_id: "source_port_u1_pin14",
      source_component_id: "source_component_adc",
      pin_number: 14,
      name: "pin14",
      port_hints: ["HX711_DOUT"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_u1_pin15",
      source_component_id: "source_component_adc",
      pin_number: 15,
      name: "pin15",
      port_hints: ["BRIDGE_EXC_P"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_r1_pin1",
      source_component_id: "source_component_dout_pullup",
      pin_number: 1,
      name: "pin1",
      port_hints: ["anode", "pos", "left"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_r2_pin1",
      source_component_id: "source_component_exc_pullup",
      pin_number: 1,
      name: "pin1",
      port_hints: ["anode", "pos", "left"],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_hx711_dout",
      connected_source_port_ids: [
        "source_port_u1_pin14",
        "source_port_r1_pin1",
      ],
      connected_source_net_ids: [],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_bridge_exc",
      connected_source_port_ids: [
        "source_port_u1_pin15",
        "source_port_r2_pin1",
      ],
      connected_source_net_ids: [],
    },
  ]

  const readableNetlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(readableNetlist).toContain("NET: U1_HX711_DOUT")
  expect(readableNetlist).toContain("  - U1 pin14 (HX711_DOUT)")
  expect(readableNetlist).toContain("NET: U1_BRIDGE_EXC_P")
  expect(readableNetlist).toContain("  - U1 pin15 (BRIDGE_EXC_P)")
})
