import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"

declare module "bun:test" {
  interface Matchers<T = unknown> {
    toMatchInlineSnapshot(snapshot?: string | null): Promise<MatcherResult>
  }
}

it("uses descriptive chip labels instead of generic pin names", () => {
  const circuitJson: any[] = [
    {
      type: "source_component",
      source_component_id: "source_component_0",
      name: "U1",
      ftype: "simple_chip",
      manufacturer_part_number: "RP2040",
    },
    {
      type: "source_component",
      source_component_id: "source_component_1",
      name: "J1",
      ftype: "simple_chip",
      manufacturer_part_number: "HEADER",
    },
    {
      type: "source_port",
      source_port_id: "source_port_0",
      source_component_id: "source_component_0",
      name: "pin14",
      pin_number: 14,
      port_hints: ["GPIO14", "SCL"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_1",
      source_component_id: "source_component_1",
      name: "pin1",
      pin_number: 1,
      port_hints: ["SCL"],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_0",
      connected_source_port_ids: ["source_port_0", "source_port_1"],
      connected_source_net_ids: [],
    },
  ]

  expect(
    convertCircuitJsonToReadableNetlist(circuitJson),
  ).toMatchInlineSnapshot(`
    "COMPONENTS:
     - U1: RP2040
     - J1: HEADER

    NET: U1_SCL
      - U1 GPIO14 (SCL)
      - J1 SCL


    COMPONENT_PINS:
    U1 (RP2040)
    - GPIO14(pin14, SCL): NETS(U1_SCL)

    J1 (HEADER)
    - SCL(pin1): NETS(U1_SCL)
    "
  `)
})
