import { expect, it } from "bun:test"
import type { AnyCircuitElement } from "circuit-json"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"

declare module "bun:test" {
  interface Matchers<T = unknown> {
    toMatchInlineSnapshot(snapshot?: string | null): Promise<MatcherResult>
  }
}

it("uses descriptive chip pin hints when the source port name is generic", () => {
  const circuitJson = [
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_0",
      name: "U1",
      manufacturer_part_number: "RP2040",
    },
    {
      type: "source_component",
      ftype: "simple_resistor",
      source_component_id: "source_component_1",
      name: "R1",
      resistance: 10000,
      display_resistance: "10k",
    },
    {
      type: "source_port",
      source_port_id: "source_port_0",
      source_component_id: "source_component_0",
      pin_number: 14,
      name: "pin14",
      port_hints: ["14", "pin14", "GP10", "SCLK"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_1",
      source_component_id: "source_component_1",
      pin_number: 1,
      name: "pin1",
      port_hints: ["pin1", "anode", "pos", "left"],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_0",
      connected_source_port_ids: ["source_port_0", "source_port_1"],
      connected_source_net_ids: [],
    },
  ] as AnyCircuitElement[]

  expect(
    convertCircuitJsonToReadableNetlist(circuitJson),
  ).toMatchInlineSnapshot(`
    "COMPONENTS:
     - U1: RP2040
     - R1: 10k resistor

    NET: U1_SCLK
      - U1 GP10 (SCLK)
      - R1 pin1


    COMPONENT_PINS:
    U1 (RP2040)
    - pin14(GP10, SCLK): NETS(U1_SCLK)

    R1 (10k)
    - pin1(anode, pos, left): NETS(U1_SCLK)
    "
  `)
})
