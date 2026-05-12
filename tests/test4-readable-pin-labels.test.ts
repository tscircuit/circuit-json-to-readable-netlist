import { expect, it } from "bun:test"
import type { AnyCircuitElement } from "circuit-json"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"

declare module "bun:test" {
  interface Matchers<T = unknown> {
    toMatchInlineSnapshot(snapshot?: string | null): Promise<MatcherResult>
  }
}

it("uses semantic pin labels when numbered pin names have better hints", () => {
  const circuitJson = [
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_1",
      name: "U1",
      manufacturer_part_number: "PICO-W",
    },
    {
      type: "source_component",
      ftype: "simple_resistor",
      source_component_id: "source_component_2",
      name: "R1",
      resistance: 1000,
      display_resistance: "1k",
    },
    {
      type: "source_port",
      source_port_id: "source_port_1",
      source_component_id: "source_component_1",
      name: "pin14",
      pin_number: 14,
      port_hints: ["GPIO22", "SCL1", "pin14", "14"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_2",
      source_component_id: "source_component_2",
      name: "pin1",
      pin_number: 1,
      port_hints: ["pin1", "1"],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_1",
      connected_source_port_ids: ["source_port_1", "source_port_2"],
      connected_source_net_ids: [],
    },
  ] as AnyCircuitElement[]

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).not.toContain("undefined")
  expect(netlist).not.toContain("  - U1 pin14")
  expect(netlist).toMatchInlineSnapshot(`
    "COMPONENTS:
     - U1: PICO-W
     - R1: 1k resistor

    NET: U1_SCL1
      - U1 GPIO22 (SCL1)
      - R1 pin1


    COMPONENT_PINS:
    U1 (PICO-W)
    - pin14(GPIO22, SCL1): NETS(U1_SCL1)

    R1 (1k)
    - pin1: NETS(U1_SCL1)
    "
  `)
})
