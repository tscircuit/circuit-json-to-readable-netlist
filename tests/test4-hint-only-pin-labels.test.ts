import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"

declare module "bun:test" {
  interface Matchers<T = unknown> {
    toMatchInlineSnapshot(snapshot?: string | null): Promise<MatcherResult>
  }
}

it("prefers meaningful port hints when a port name is missing", () => {
  const circuitJson = [
    {
      type: "source_component",
      source_component_id: "source_component_1",
      name: "U1",
      ftype: "simple_chip",
      manufacturer_part_number: "74HC14",
    },
    {
      type: "source_port",
      source_port_id: "source_port_1",
      source_component_id: "source_component_1",
      pin_number: 14,
      port_hints: ["VCC", "right"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_2",
      source_component_id: "source_component_1",
      pin_number: 7,
      port_hints: ["GND", "left"],
    },
    {
      type: "source_net",
      source_net_id: "source_net_1",
      name: "VCC",
    },
    {
      type: "source_net",
      source_net_id: "source_net_2",
      name: "GND",
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_1",
      connected_source_port_ids: ["source_port_1"],
      connected_source_net_ids: ["source_net_1"],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_2",
      connected_source_port_ids: ["source_port_2"],
      connected_source_net_ids: ["source_net_2"],
    },
  ] as any

  expect(
    convertCircuitJsonToReadableNetlist(circuitJson),
  ).toMatchInlineSnapshot(`
    "COMPONENTS:
     - U1: 74HC14


    EMPTY NET PINS:
      - U1 VCC
      - U1 GND

    COMPONENT_PINS:
    U1 (74HC14)
    - GND(pin7, left): NETS(GND)
    - VCC(pin14, right): NETS(VCC)
    "
  `)
})
