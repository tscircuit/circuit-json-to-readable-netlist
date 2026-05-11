import { expect, it } from "bun:test"
import type { AnyCircuitElement } from "circuit-json"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"

declare module "bun:test" {
  interface Matchers<T = unknown> {
    toMatchInlineSnapshot(snapshot?: string | null): Promise<MatcherResult>
  }
}

it("renders internally connected source ports as a net", () => {
  const circuitJson = [
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_j1",
      name: "J1",
      manufacturer_part_number: "TEST_HEADER",
      internally_connected_source_port_ids: [
        ["source_port_j1_a", "source_port_j1_b"],
      ],
    },
    {
      type: "source_port",
      source_port_id: "source_port_j1_a",
      source_component_id: "source_component_j1",
      name: "A",
      pin_number: 1,
      port_hints: ["A"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_j1_b",
      source_component_id: "source_component_j1",
      name: "B",
      pin_number: 2,
      port_hints: ["B"],
    },
  ] as AnyCircuitElement[]

  expect(
    convertCircuitJsonToReadableNetlist(circuitJson),
  ).toMatchInlineSnapshot(`
    "COMPONENTS:
     - J1: TEST_HEADER

    NET: J1_A
      - J1 A
      - J1 B


    COMPONENT_PINS:
    J1 (TEST_HEADER)
    - pin1(A): NETS(J1_A)
    - pin2(B): NETS(J1_A)
    "
  `)
})
