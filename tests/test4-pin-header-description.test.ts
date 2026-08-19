import { expect, it } from "bun:test"
import type { AnyCircuitElement } from "circuit-json"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"

declare module "bun:test" {
  interface Matchers<T = unknown> {
    toMatchInlineSnapshot(snapshot?: string | null): Promise<MatcherResult>
  }
}

it("renders simple pin header descriptions", () => {
  const circuitJson: AnyCircuitElement[] = [
    {
      type: "source_component",
      source_component_id: "source_component_j1",
      ftype: "simple_pin_header",
      name: "J1",
      manufacturer_part_number: "HDR-4",
      pin_count: 4,
      gender: "female",
      display_value: "I2C expansion",
    },
    {
      type: "cad_component",
      cad_component_id: "cad_component_j1",
      pcb_component_id: "pcb_component_j1",
      source_component_id: "source_component_j1",
      position: { x: 0, y: 0, z: 0 },
      footprinter_string: "pinrow4_p2.54",
    },
    {
      type: "source_port",
      source_port_id: "source_port_j1_1",
      source_component_id: "source_component_j1",
      pin_number: 1,
      name: "pin1",
      port_hints: ["SDA"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_j1_2",
      source_component_id: "source_component_j1",
      pin_number: 2,
      name: "pin2",
      port_hints: ["SCL"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_j1_3",
      source_component_id: "source_component_j1",
      pin_number: 3,
      name: "pin3",
      port_hints: ["VCC"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_j1_4",
      source_component_id: "source_component_j1",
      pin_number: 4,
      name: "pin4",
      port_hints: ["GND"],
    },
  ]

  expect(
    convertCircuitJsonToReadableNetlist(circuitJson),
  ).toMatchInlineSnapshot(`
    "COMPONENTS:
     - J1: I2C expansion, 4-pin female header, pinrow4_p2.54


    COMPONENT_PINS:
    J1 (I2C expansion, 4-pin female header, pinrow4_p2.54)
    - pin1(SDA): NOT_CONNECTED
    - pin2(SCL): NOT_CONNECTED
    - pin3(VCC): NOT_CONNECTED
    - pin4(GND): NOT_CONNECTED
    "
  `)
})
