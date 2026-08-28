import { expect, it } from "bun:test"
import type { AnyCircuitElement } from "circuit-json"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"

declare module "bun:test" {
  interface Matchers<T = unknown> {
    toMatchInlineSnapshot(snapshot?: string | null): Promise<MatcherResult>
  }
}

it("falls back to source component id for whitespace-only component names", () => {
  const circuitJson: AnyCircuitElement[] = [
    {
      type: "source_component",
      source_component_id: "source_component_1",
      name: "   ",
      ftype: "simple_chip",
      manufacturer_part_number: "MCU",
    } as any,
    {
      type: "source_port",
      source_port_id: "source_port_1",
      source_component_id: "source_component_1",
      name: "SDA",
      pin_number: 1,
      port_hints: ["SDA"],
    },
    {
      type: "source_component",
      source_component_id: "source_component_2",
      name: "R1",
      ftype: "simple_resistor",
      display_resistance: "1k",
    } as any,
    {
      type: "source_port",
      source_port_id: "source_port_2",
      source_component_id: "source_component_2",
      name: "pin1",
      pin_number: 1,
      port_hints: ["anode", "pos"],
    },
    {
      type: "cad_component",
      cad_component_id: "cad_component_1",
      source_component_id: "source_component_2",
      footprinter_string: "0402",
    } as any,
    {
      type: "source_trace",
      source_trace_id: "source_trace_1",
      connected_source_port_ids: ["source_port_1", "source_port_2"],
    },
  ]

  expect(
    convertCircuitJsonToReadableNetlist(circuitJson),
  ).toMatchInlineSnapshot(`
      "COMPONENTS:
       - source_component_1: MCU
       - R1: 1k 0402 resistor

      NET: source_component_1_SDA
        - source_component_1 SDA
        - R1 pin1


      COMPONENT_PINS:
      source_component_1 (MCU)
      - pin1(SDA): NETS(source_component_1_SDA)

      R1 (1k 0402)
      - pin1(anode, pos): NETS(source_component_1_SDA)
      "
    `)
})
