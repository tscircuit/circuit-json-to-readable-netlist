import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"

it("renders internally connected source ports as connected nets", () => {
  const circuitJson: any[] = [
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_1",
      name: "U1",
      manufacturer_part_number: "TEST_CHIP",
      internally_connected_source_port_ids: [
        ["source_port_1", "source_port_2"],
      ],
    },
    {
      type: "source_port",
      source_port_id: "source_port_1",
      source_component_id: "source_component_1",
      name: "A",
      pin_number: 1,
      port_hints: ["A"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_2",
      source_component_id: "source_component_1",
      name: "B",
      pin_number: 2,
      port_hints: ["B"],
    },
  ]

  expect(
    convertCircuitJsonToReadableNetlist(circuitJson),
  ).toMatchInlineSnapshot(`
    "COMPONENTS:
     - U1: TEST_CHIP

    NET: U1_A
      - U1 A
      - U1 B


    COMPONENT_PINS:
    U1 (TEST_CHIP)
    - pin1(A): NETS(U1_A)
    - pin2(B): NETS(U1_A)
    "
  `)
})
