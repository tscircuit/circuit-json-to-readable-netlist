import { expect, it } from "bun:test"
import type { AnyCircuitElement } from "circuit-json"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"

declare module "bun:test" {
  interface Matchers<T = unknown> {
    toMatchInlineSnapshot(snapshot?: string | null): Promise<MatcherResult>
  }
}

it("preserves keypad matrix pin aliases in readable net entries", () => {
  const circuitJson: AnyCircuitElement[] = [
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_0",
      name: "U1",
      manufacturer_part_number: "KEYPAD_CONTROLLER",
    },
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_1",
      name: "J1",
      manufacturer_part_number: "KEYPAD_HEADER",
    },
    {
      type: "source_port",
      source_port_id: "source_port_0",
      source_component_id: "source_component_0",
      name: "pin14",
      pin_number: 14,
      port_hints: ["ROW0"],
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
      port_hints: ["KEY_COL"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_3",
      source_component_id: "source_component_1",
      name: "pin2",
      pin_number: 2,
      port_hints: ["pos"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_4",
      source_component_id: "source_component_0",
      name: "pin16",
      pin_number: 16,
      port_hints: ["KSI0"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_5",
      source_component_id: "source_component_1",
      name: "pin3",
      pin_number: 3,
      port_hints: ["KSI0"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_6",
      source_component_id: "source_component_0",
      name: "pin17",
      pin_number: 17,
      port_hints: ["KSO0"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_7",
      source_component_id: "source_component_1",
      name: "pin4",
      pin_number: 4,
      port_hints: ["KSO0"],
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
    {
      type: "source_trace",
      source_trace_id: "source_trace_3",
      connected_source_port_ids: ["source_port_6", "source_port_7"],
      connected_source_net_ids: [],
    },
  ]

  expect(
    convertCircuitJsonToReadableNetlist(circuitJson),
  ).toMatchInlineSnapshot(`
    "COMPONENTS:
     - U1: KEYPAD_CONTROLLER
     - J1: KEYPAD_HEADER

    NET: U1_ROW0
      - U1 pin14 (ROW0)
      - J1 pin1 (+)

    NET: U1_KEY_COL
      - U1 pin15 (KEY_COL)
      - J1 pin2 (+)

    NET: U1_KSI0
      - U1 pin16 (KSI0)
      - J1 pin3 (KSI0)

    NET: U1_KSO0
      - U1 pin17 (KSO0)
      - J1 pin4 (KSO0)


    COMPONENT_PINS:
    U1 (KEYPAD_CONTROLLER)
    - pin14(ROW0): NETS(U1_ROW0)
    - pin15(KEY_COL): NETS(U1_KEY_COL)
    - pin16(KSI0): NETS(U1_KSI0)
    - pin17(KSO0): NETS(U1_KSO0)

    J1 (KEYPAD_HEADER)
    - pin1(pos): NETS(U1_ROW0)
    - pin2(pos): NETS(U1_KEY_COL)
    - pin3(KSI0): NETS(U1_KSI0)
    - pin4(KSO0): NETS(U1_KSO0)
    "
  `)
})
