import { expect, it } from "bun:test"
import type { AnyCircuitElement } from "circuit-json"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"

declare module "bun:test" {
  interface Matchers<T = unknown> {
    toMatchInlineSnapshot(snapshot?: string | null): Promise<MatcherResult>
  }
}

it("renders switch and push button descriptions", () => {
  const circuitJson: AnyCircuitElement[] = [
    {
      type: "source_component",
      ftype: "simple_switch",
      source_component_id: "source_component_sw1",
      name: "SW1",
      display_value: "SPDT",
    },
    {
      type: "source_port",
      source_port_id: "source_port_sw1_1",
      source_component_id: "source_component_sw1",
      name: "pin1",
      pin_number: 1,
      port_hints: ["common"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_sw1_2",
      source_component_id: "source_component_sw1",
      name: "pin2",
      pin_number: 2,
      port_hints: ["throw"],
    },
    {
      type: "cad_component",
      cad_component_id: "cad_component_sw1",
      source_component_id: "source_component_sw1",
      pcb_component_id: "pcb_component_sw1",
      footprinter_string: "slide",
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
    },
    {
      type: "source_component",
      ftype: "simple_push_button",
      source_component_id: "source_component_btn1",
      name: "BTN1",
      display_value: "momentary",
    },
    {
      type: "source_port",
      source_port_id: "source_port_btn1_1",
      source_component_id: "source_component_btn1",
      name: "pin1",
      pin_number: 1,
      port_hints: ["left"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_btn1_2",
      source_component_id: "source_component_btn1",
      name: "pin2",
      pin_number: 2,
      port_hints: ["right"],
    },
    {
      type: "cad_component",
      cad_component_id: "cad_component_btn1",
      source_component_id: "source_component_btn1",
      pcb_component_id: "pcb_component_btn1",
      footprinter_string: "tactile",
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
    },
  ] as AnyCircuitElement[]

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)
  expect(netlist).not.toContain("source_component")
  expect(netlist).toMatchInlineSnapshot(`
    "COMPONENTS:
     - SW1: SPDT slide switch
     - BTN1: momentary tactile push button


    COMPONENT_PINS:
    SW1 (SPDT slide switch)
    - pin1(common): NOT_CONNECTED
    - pin2(throw): NOT_CONNECTED

    BTN1 (momentary tactile push button)
    - pin1(left): NOT_CONNECTED
    - pin2(right): NOT_CONNECTED
    "
  `)
})
