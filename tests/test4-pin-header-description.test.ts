import { expect, it } from "bun:test"
import type { AnyCircuitElement } from "circuit-json"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"

it("renders simple pin header metadata in readable netlists", () => {
  const circuitJson = [
    {
      type: "source_component",
      ftype: "simple_pin_header",
      source_component_id: "source_component_j1",
      name: "J1",
      manufacturer_part_number: "HDR-4F",
      display_value: "shrouded",
      pin_count: 4,
      gender: "female",
    },
    {
      type: "cad_component",
      cad_component_id: "cad_component_j1",
      source_component_id: "source_component_j1",
      footprinter_string: "pinrow4",
    },
    {
      type: "source_port",
      source_port_id: "source_port_j1_1",
      source_component_id: "source_component_j1",
      name: "pin1",
      pin_number: 1,
      port_hints: ["pin1", "1"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_j1_2",
      source_component_id: "source_component_j1",
      name: "pin2",
      pin_number: 2,
      port_hints: ["pin2", "2"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_j1_3",
      source_component_id: "source_component_j1",
      name: "pin3",
      pin_number: 3,
      port_hints: ["pin3", "3"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_j1_4",
      source_component_id: "source_component_j1",
      name: "pin4",
      pin_number: 4,
      port_hints: ["pin4", "4"],
    },
  ] as AnyCircuitElement[]

  expect(
    convertCircuitJsonToReadableNetlist(circuitJson),
  ).toMatchInlineSnapshot(`
    "COMPONENTS:
     - J1: HDR-4F, 4-pin female shrouded pinrow4 pin header


    COMPONENT_PINS:
    J1 (HDR-4F, 4-pin female shrouded pinrow4 pin header)
    - pin1: NOT_CONNECTED
    - pin2: NOT_CONNECTED
    - pin3: NOT_CONNECTED
    - pin4: NOT_CONNECTED
    "
  `)
})
