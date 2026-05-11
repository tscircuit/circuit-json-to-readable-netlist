import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"

declare module "bun:test" {
  interface Matchers<T = unknown> {
    toMatchInlineSnapshot(snapshot?: string | null): Promise<MatcherResult>
  }
}

it("uses SPI chip select hints for generic numbered chip pins", () => {
  const circuitJson = [
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_1",
      name: "U1",
      manufacturer_part_number: "MCU",
    },
    {
      type: "cad_component",
      cad_component_id: "cad_component_1",
      source_component_id: "source_component_1",
      footprinter_string: "soic8",
    },
    {
      type: "source_port",
      source_port_id: "source_port_1",
      source_component_id: "source_component_1",
      name: "pin14",
      pin_number: 1,
      port_hints: ["CS0"],
    },
    {
      type: "source_component",
      ftype: "simple_resistor",
      source_component_id: "source_component_2",
      name: "R1",
      resistance: 10000,
      display_resistance: "10kΩ",
    },
    {
      type: "cad_component",
      cad_component_id: "cad_component_2",
      source_component_id: "source_component_2",
      footprinter_string: "0402",
    },
    {
      type: "source_port",
      source_port_id: "source_port_2",
      source_component_id: "source_component_2",
      name: "pin1",
      pin_number: 1,
      port_hints: ["anode", "pos", "left"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_3",
      source_component_id: "source_component_2",
      name: "pin2",
      pin_number: 2,
      port_hints: ["cathode", "neg", "right"],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_1",
      connected_source_port_ids: ["source_port_1", "source_port_2"],
      connected_source_net_ids: [],
    },
  ] as any

  expect(
    convertCircuitJsonToReadableNetlist(circuitJson),
  ).toMatchInlineSnapshot(`
    "COMPONENTS:
     - U1: MCU, soic8
     - R1: 10kΩ 0402 resistor

    NET: U1_CS0
      - U1 pin14 (CS0)
      - R1 pin1


    COMPONENT_PINS:
    U1 (MCU)
    - pin1(pin14, CS0): NETS(U1_CS0)

    R1 (10kΩ 0402)
    - pin1(anode, pos, left): NETS(U1_CS0)
    - pin2(cathode, neg, right): NOT_CONNECTED
    "
  `)
})
