import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"

declare module "bun:test" {
  interface Matchers<T = unknown> {
    toMatchInlineSnapshot(snapshot?: string | null): Promise<MatcherResult>
  }
}

it("prefers digit-bearing audio amplifier aliases over passive labels", () => {
  const circuitJson = [
    {
      type: "source_component",
      source_component_id: "source_component_u1",
      name: "U1",
      ftype: "simple_chip",
      manufacturer_part_number: "AMP1",
    },
    {
      type: "source_component",
      source_component_id: "source_component_r1",
      name: "R1",
      ftype: "simple_resistor",
      display_resistance: "10kΩ",
    },
    {
      type: "source_port",
      source_port_id: "source_port_u1",
      source_component_id: "source_component_u1",
      pin_number: 14,
      port_hints: ["SPK_OUT1"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_r1",
      source_component_id: "source_component_r1",
      pin_number: 1,
      port_hints: ["pos"],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_1",
      connected_source_port_ids: ["source_port_u1", "source_port_r1"],
      connected_source_net_ids: [],
    },
  ] as any

  expect(
    convertCircuitJsonToReadableNetlist(circuitJson),
  ).toMatchInlineSnapshot(`
    "COMPONENTS:
     - U1: AMP1
     - R1: 10kΩ resistor

    NET: U1_SPK_OUT1
      - U1 Pin14 (SPK_OUT1)
      - R1 Pin1


    COMPONENT_PINS:
    U1 (AMP1)
    - pin14(SPK_OUT1): NETS(U1_SPK_OUT1)

    R1 (10kΩ undefined)
    - pin1(pos): NETS(U1_SPK_OUT1)
    "
  `)
})
