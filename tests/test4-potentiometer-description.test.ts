import { expect, it } from "bun:test"
import type { AnyCircuitElement } from "circuit-json"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"

it("renders simple potentiometers with readable descriptions", () => {
  const circuitJson: AnyCircuitElement[] = [
    {
      type: "source_component",
      ftype: "simple_potentiometer",
      source_component_id: "source_component_1",
      name: "RV1",
      max_resistance: 10000,
      display_value: "10kΩ",
    },
    {
      type: "cad_component",
      cad_component_id: "cad_component_1",
      pcb_component_id: "pcb_component_1",
      source_component_id: "source_component_1",
      footprinter_string: "potentiometer_tht_3pin",
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      layer: "top",
    },
    {
      type: "source_port",
      source_port_id: "source_port_1",
      source_component_id: "source_component_1",
      name: "CCW",
      pin_number: 1,
      port_hints: ["ccw", "pin1"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_2",
      source_component_id: "source_component_1",
      name: "WIPER",
      pin_number: 2,
      port_hints: ["wiper", "pin2"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_3",
      source_component_id: "source_component_1",
      name: "CW",
      pin_number: 3,
      port_hints: ["cw", "pin3"],
    },
  ]

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toMatchInlineSnapshot(`
    "COMPONENTS:
     - RV1: 10kΩ potentiometer_tht_3pin potentiometer


    COMPONENT_PINS:
    RV1 (10kΩ potentiometer_tht_3pin potentiometer)
    - pin1(CCW, ccw): NOT_CONNECTED
    - pin2(WIPER, wiper): NOT_CONNECTED
    - pin3(CW, cw): NOT_CONNECTED
    "
  `)
})
