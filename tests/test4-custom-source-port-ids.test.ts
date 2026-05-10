import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"

declare module "bun:test" {
  interface Matchers<T = unknown> {
    toMatchInlineSnapshot(snapshot?: string | null): Promise<MatcherResult>
  }
}

it("custom source port ids are treated as connected ports", () => {
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
      type: "source_port",
      source_port_id: "u1.scl",
      source_component_id: "source_component_u1",
      name: "SCL",
      pin_number: 1,
      port_hints: ["SCL"],
    },
    {
      type: "source_port",
      source_port_id: "j1.scl",
      source_component_id: "source_component_j1",
      name: "SCL",
      pin_number: 1,
      port_hints: ["SCL"],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_scl",
      connected_source_port_ids: ["u1.scl", "j1.scl"],
      connected_source_net_ids: [],
    },
  ] as any

  expect(
    convertCircuitJsonToReadableNetlist(circuitJson),
  ).toMatchInlineSnapshot(`
    "COMPONENTS:
     - U1: MCU
     - J1: HEADER

    NET: U1_SCL
      - U1 SCL
      - J1 SCL


    COMPONENT_PINS:
    U1 (MCU)
    - pin1(SCL): NETS(U1_SCL)

    J1 (HEADER)
    - pin1(SCL): NETS(U1_SCL)
    "
  `)
})
