import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"

declare module "bun:test" {
  interface Matchers<T = unknown> {
    toMatchInlineSnapshot(snapshot?: string | null): Promise<MatcherResult>
  }
}

it("dedupes repeated pin aliases in net and component pin output", () => {
  const circuitJson = [
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_0",
      name: "U1",
      manufacturer_part_number: "DUPLICATE_LABEL_CHIP",
    },
    {
      type: "source_component",
      ftype: "simple_resistor",
      source_component_id: "source_component_1",
      name: "R1",
      display_resistance: "1kΩ",
    },
    {
      type: "cad_component",
      cad_component_id: "cad_component_1",
      source_component_id: "source_component_1",
      footprinter_string: "0402",
    },
    {
      type: "source_port",
      source_port_id: "source_port_0",
      source_component_id: "source_component_0",
      name: "GPIO2",
      pin_number: 1,
      port_hints: ["GPIO2", "gpio2", "SDA", "SDA", "sda"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_1",
      source_component_id: "source_component_1",
      name: "pin1",
      pin_number: 1,
      port_hints: ["anode", "pos", "left"],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_0",
      connected_source_port_ids: ["source_port_0", "source_port_1"],
      connected_source_net_ids: [],
    },
  ] as any[]

  expect(
    convertCircuitJsonToReadableNetlist(circuitJson),
  ).toMatchInlineSnapshot(`
    "COMPONENTS:
     - U1: DUPLICATE_LABEL_CHIP
     - R1: 1kΩ 0402 resistor

    NET: U1_SDA
      - U1 GPIO2 (SDA)
      - R1 pin1


    COMPONENT_PINS:
    U1 (DUPLICATE_LABEL_CHIP)
    - pin1(GPIO2, SDA): NETS(U1_SDA)

    R1 (1kΩ 0402)
    - pin1(anode, pos, left): NETS(U1_SDA)
    "
  `)
})
