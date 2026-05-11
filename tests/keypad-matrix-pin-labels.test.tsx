import { expect, it } from "bun:test"
import type { AnyCircuitElement } from "circuit-json"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { scorePhrase } from "lib/scorePhrase"

declare module "bun:test" {
  interface Matchers<T = unknown> {
    toMatchInlineSnapshot(snapshot?: string | null): Promise<MatcherResult>
  }
}

it("scores keypad matrix aliases above generic numbered pins", () => {
  expect(scorePhrase("KEY_ROW0")).toBeGreaterThan(1)
  expect(scorePhrase("KEY_COL1")).toBeGreaterThan(1)
  expect(scorePhrase("SCAN_ROW2")).toBeGreaterThan(1)
  expect(scorePhrase("KSO3")).toBeGreaterThan(1)
})

it("preserves keypad matrix row and column labels", () => {
  const circuitJson: AnyCircuitElement[] = [
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_0",
      name: "U1",
      manufacturer_part_number: "KEYPAD_CTRL",
    },
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_1",
      name: "J1",
      manufacturer_part_number: "KEYPAD_HEADER",
    },
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_2",
      name: "RP1",
      manufacturer_part_number: "PULLUP_ARRAY",
    },
    {
      type: "source_port",
      source_port_id: "source_port_0",
      source_component_id: "source_component_0",
      pin_number: 14,
      name: "pin14",
      port_hints: ["ROW0"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_1",
      source_component_id: "source_component_0",
      pin_number: 15,
      name: "pin15",
      port_hints: ["COL1"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_2",
      source_component_id: "source_component_1",
      pin_number: 1,
      name: "pin1",
      port_hints: ["KSI0"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_3",
      source_component_id: "source_component_1",
      pin_number: 2,
      name: "pin2",
      port_hints: ["KSO1"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_4",
      source_component_id: "source_component_2",
      pin_number: 1,
      name: "pin1",
      port_hints: ["pos"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_5",
      source_component_id: "source_component_2",
      pin_number: 2,
      name: "pin2",
      port_hints: ["pos"],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_0",
      connected_source_port_ids: [
        "source_port_0",
        "source_port_2",
        "source_port_4",
      ],
      connected_source_net_ids: [],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_1",
      connected_source_port_ids: [
        "source_port_1",
        "source_port_3",
        "source_port_5",
      ],
      connected_source_net_ids: [],
    },
  ]

  expect(
    convertCircuitJsonToReadableNetlist(circuitJson),
  ).toMatchInlineSnapshot(`
    "COMPONENTS:
     - U1: KEYPAD_CTRL
     - J1: KEYPAD_HEADER
     - RP1: PULLUP_ARRAY

    NET: U1_ROW0
      - U1 pin14 (ROW0)
      - J1 pin1 (KSI0)
      - RP1 pin1 (+)

    NET: U1_COL1
      - U1 pin15 (COL1)
      - J1 pin2 (KSO1)
      - RP1 pin2 (+)


    COMPONENT_PINS:
    U1 (KEYPAD_CTRL)
    - pin14(ROW0): NETS(U1_ROW0)
    - pin15(COL1): NETS(U1_COL1)

    J1 (KEYPAD_HEADER)
    - pin1(KSI0): NETS(U1_ROW0)
    - pin2(KSO1): NETS(U1_COL1)

    RP1 (PULLUP_ARRAY)
    - pin1(pos): NETS(U1_ROW0)
    - pin2(pos): NETS(U1_COL1)
    "
  `)
})
