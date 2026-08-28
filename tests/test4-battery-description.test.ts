import { expect, it } from "bun:test"
import type { AnyCircuitElement } from "circuit-json"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"

it("renders simple_battery value and footprint in component descriptions", () => {
  const circuitJson: AnyCircuitElement[] = [
    {
      type: "source_component",
      ftype: "simple_battery",
      source_component_id: "source_component_0",
      name: "B1",
      capacity: 1000,
      display_value: "1000mAh",
    },
    {
      type: "cad_component",
      cad_component_id: "cad_component_0",
      pcb_component_id: "pcb_component_0",
      source_component_id: "source_component_0",
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      footprinter_string: "battery_holder",
      layer: "top",
    },
    {
      type: "source_port",
      source_port_id: "source_port_0",
      source_component_id: "source_component_0",
      name: "pos",
      pin_number: 1,
      port_hints: ["positive"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_1",
      source_component_id: "source_component_0",
      name: "neg",
      pin_number: 2,
      port_hints: ["negative"],
    },
  ]

  expect(
    convertCircuitJsonToReadableNetlist(circuitJson),
  ).toMatchInlineSnapshot(`
    "COMPONENTS:
     - B1: 1000mAh battery_holder battery


    COMPONENT_PINS:
    B1 (1000mAh battery_holder)
    - pin1(pos, positive): NOT_CONNECTED
    - pin2(neg, negative): NOT_CONNECTED
    "
  `)
})
