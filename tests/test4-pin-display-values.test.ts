import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"

declare module "bun:test" {
  interface Matchers<T = unknown> {
    toMatchInlineSnapshot(snapshot?: string | null): Promise<MatcherResult>
  }
}

it("trims pin display values and omits blank display labels", () => {
  const circuitJson = [
    {
      type: "source_component",
      source_component_id: "source_component_u1",
      ftype: "simple_chip",
      name: "U1",
      manufacturer_part_number: "MCU",
      display_value: "  Sensor core  ",
    },
    {
      type: "source_component",
      source_component_id: "source_component_j1",
      ftype: "simple_chip",
      name: "J1",
      manufacturer_part_number: "HEADER",
      display_value: "   ",
    },
    {
      type: "source_net",
      source_net_id: "source_net_signal",
      name: "SIGNAL",
      member_source_group_ids: [],
    },
    {
      type: "source_port",
      source_port_id: "source_port_u1_gpio",
      source_component_id: "source_component_u1",
      name: "GPIO1",
      pin_number: 1,
      port_hints: ["GPIO1"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_j1_signal",
      source_component_id: "source_component_j1",
      name: "pin1",
      pin_number: 1,
      port_hints: ["pin1"],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_signal",
      connected_source_port_ids: [
        "source_port_u1_gpio",
        "source_port_j1_signal",
      ],
      connected_source_net_ids: ["source_net_signal"],
    },
  ] as any

  expect(
    convertCircuitJsonToReadableNetlist(circuitJson),
  ).toMatchInlineSnapshot(`
    "COMPONENTS:
     - U1: MCU
     - J1: HEADER

    NET: SIGNAL
      - U1 GPIO1 (Sensor core)
      - J1 pin1


    COMPONENT_PINS:
    U1 (MCU)
    - pin1(GPIO1): NETS(SIGNAL)

    J1 (HEADER)
    - pin1: NETS(SIGNAL)
    "
  `)
})
