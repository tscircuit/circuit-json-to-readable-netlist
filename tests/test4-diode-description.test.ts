import { expect, it } from "bun:test"
import type { AnyCircuitElement } from "circuit-json"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"

it("renders simple_diode value and footprint in component descriptions", () => {
  const circuitJson: AnyCircuitElement[] = [
    {
      type: "source_component",
      ftype: "simple_diode",
      source_component_id: "source_component_0",
      name: "D1",
      display_value: "1N4148",
    },
    {
      type: "cad_component",
      cad_component_id: "cad_component_0",
      pcb_component_id: "pcb_component_0",
      source_component_id: "source_component_0",
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      footprinter_string: "SOD-123",
      layer: "top",
    },
    {
      type: "source_port",
      source_port_id: "source_port_0",
      source_component_id: "source_component_0",
      name: "anode",
      pin_number: 1,
      port_hints: ["A"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_1",
      source_component_id: "source_component_0",
      name: "cathode",
      pin_number: 2,
      port_hints: ["K"],
    },
  ]

  expect(
    convertCircuitJsonToReadableNetlist(circuitJson),
  ).toMatchInlineSnapshot(`
    "COMPONENTS:
     - D1: 1N4148 SOD-123 diode


    COMPONENT_PINS:
    D1 (1N4148 SOD-123)
    - pin1(anode, A): NOT_CONNECTED
    - pin2(cathode, K): NOT_CONNECTED
    "
  `)
})
