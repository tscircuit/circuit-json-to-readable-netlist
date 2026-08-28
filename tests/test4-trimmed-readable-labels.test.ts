import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"

declare module "bun:test" {
  interface Matchers<T = unknown> {
    toMatchInlineSnapshot(snapshot?: string | null): Promise<MatcherResult>
  }
}

it("ignores whitespace-only source labels and trims readable aliases", () => {
  const circuitJson = [
    {
      type: "source_component",
      source_component_id: "source_component_u1",
      ftype: "simple_chip",
      name: "U1",
      manufacturer_part_number: "MCU",
    },
    {
      type: "source_component",
      source_component_id: "source_component_j1",
      ftype: "simple_chip",
      name: "J1",
      manufacturer_part_number: "HEADER",
    },
    {
      type: "source_net",
      source_net_id: "source_net_signal",
      name: "   ",
      member_source_group_ids: [],
    },
    {
      type: "source_port",
      source_port_id: "source_port_u1_reset",
      source_component_id: "source_component_u1",
      name: "   ",
      pin_number: 14,
      port_hints: ["   ", " SCL ", "SCL"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_j1_pos",
      source_component_id: "source_component_j1",
      name: "pin1",
      pin_number: 1,
      port_hints: ["pos"],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_signal",
      connected_source_port_ids: ["source_port_u1_reset", "source_port_j1_pos"],
      connected_source_net_ids: ["source_net_signal"],
    },
  ] as any

  expect(
    convertCircuitJsonToReadableNetlist(circuitJson),
  ).toMatchInlineSnapshot(`
    "COMPONENTS:
     - U1: MCU
     - J1: HEADER

    NET: U1_SCL
      - U1 Pin14 (SCL)
      - J1 pin1 (+)


    COMPONENT_PINS:
    U1 (MCU)
    - pin14(SCL): NETS(U1_SCL)

    J1 (HEADER)
    - pin1(pos): NETS(U1_SCL)
    "
  `)
})
