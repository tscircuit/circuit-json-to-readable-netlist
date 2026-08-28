import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"

it("renders simple ground components with readable descriptions", () => {
  const circuitJson: any[] = [
    {
      type: "source_component",
      ftype: "simple_ground",
      source_component_id: "source_component_1",
      name: "GND1",
    },
    {
      type: "source_port",
      source_port_id: "source_port_1",
      source_component_id: "source_component_1",
      name: "pin1",
      pin_number: 1,
      port_hints: ["gnd", "ground"],
    },
  ]

  expect(
    convertCircuitJsonToReadableNetlist(circuitJson),
  ).toMatchInlineSnapshot(`
    "COMPONENTS:
     - GND1: ground


    COMPONENT_PINS:
    GND1 (ground)
    - pin1(gnd, ground): NOT_CONNECTED
    "
  `)
})
