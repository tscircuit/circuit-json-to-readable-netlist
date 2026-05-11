import { expect, it } from "bun:test"
import type { AnyCircuitElement } from "circuit-json"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"

it("renders crystal and resonator values in component descriptions", () => {
  const circuitJson: AnyCircuitElement[] = [
    {
      type: "source_component",
      ftype: "simple_crystal",
      source_component_id: "source_component_0",
      name: "Y1",
      frequency: 16000000,
      display_value: "16MHz",
    },
    {
      type: "cad_component",
      cad_component_id: "cad_component_0",
      pcb_component_id: "pcb_component_0",
      source_component_id: "source_component_0",
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      footprinter_string: "3225",
      layer: "top",
    },
    {
      type: "source_component",
      ftype: "simple_resonator",
      source_component_id: "source_component_1",
      name: "X1",
      frequency: 8000000,
      load_capacitance: 0.000000000012,
      display_value: "8MHz",
    },
    {
      type: "cad_component",
      cad_component_id: "cad_component_1",
      pcb_component_id: "pcb_component_1",
      source_component_id: "source_component_1",
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      footprinter_string: "CSTCE",
      layer: "top",
    },
  ]

  expect(
    convertCircuitJsonToReadableNetlist(circuitJson),
  ).toMatchInlineSnapshot(`
    "COMPONENTS:
     - Y1: 16MHz 3225 crystal
     - X1: 8MHz CSTCE resonator


    COMPONENT_PINS:
    Y1 (16MHz 3225)

    X1 (8MHz CSTCE)
    "
  `)
})
