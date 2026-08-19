import { expect, it } from "bun:test"
import type { AnyCircuitElement } from "circuit-json"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"

declare module "bun:test" {
  interface Matchers<T = unknown> {
    toMatchInlineSnapshot(snapshot?: string | null): Promise<MatcherResult>
  }
}

it("preserves SWD debug pin aliases in readable net entries", () => {
  const circuitJson: AnyCircuitElement[] = [
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_0",
      name: "U1",
      manufacturer_part_number: "STM32F103",
    },
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_1",
      name: "J1",
      manufacturer_part_number: "DEBUG_HEADER",
    },
    {
      type: "source_port",
      source_port_id: "source_port_0",
      source_component_id: "source_component_0",
      name: "pin14",
      pin_number: 14,
      port_hints: ["SWDIO"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_1",
      source_component_id: "source_component_1",
      name: "pin1",
      pin_number: 1,
      port_hints: ["SWDIO"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_2",
      source_component_id: "source_component_0",
      name: "pin15",
      pin_number: 15,
      port_hints: ["SWCLK"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_3",
      source_component_id: "source_component_1",
      name: "pin2",
      pin_number: 2,
      port_hints: ["SWCLK"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_4",
      source_component_id: "source_component_0",
      name: "pin16",
      pin_number: 16,
      port_hints: ["SWO"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_5",
      source_component_id: "source_component_1",
      name: "pin3",
      pin_number: 3,
      port_hints: ["SWO"],
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
    {
      type: "source_trace",
      source_trace_id: "source_trace_2",
      connected_source_port_ids: ["source_port_4", "source_port_5"],
      connected_source_net_ids: [],
    },
  ]

  expect(
    convertCircuitJsonToReadableNetlist(circuitJson),
  ).toMatchInlineSnapshot(`
    "COMPONENTS:
     - U1: STM32F103
     - J1: DEBUG_HEADER

    NET: U1_SWDIO
      - U1 pin14 (SWDIO)
      - J1 pin1 (SWDIO)

    NET: U1_SWCLK
      - U1 pin15 (SWCLK)
      - J1 pin2 (SWCLK)

    NET: U1_SWO
      - U1 pin16 (SWO)
      - J1 pin3 (SWO)


    COMPONENT_PINS:
    U1 (STM32F103)
    - pin14(SWDIO): NETS(U1_SWDIO)
    - pin15(SWCLK): NETS(U1_SWCLK)
    - pin16(SWO): NETS(U1_SWO)

    J1 (DEBUG_HEADER)
    - pin1(SWDIO): NETS(U1_SWDIO)
    - pin2(SWCLK): NETS(U1_SWCLK)
    - pin3(SWO): NETS(U1_SWO)
    "
  `)
})
