import { expect, it } from "bun:test"
import type { AnyCircuitElement } from "circuit-json"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"

declare module "bun:test" {
  interface Matchers<T = unknown> {
    toMatchInlineSnapshot(snapshot?: string | null): Promise<MatcherResult>
  }
}

it("uses full numeric pin labels in generated net names and pin descriptions", () => {
  const circuitJson: AnyCircuitElement[] = [
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_u1",
      name: "U1",
      manufacturer_part_number: "RP2040",
    },
    {
      type: "source_port",
      source_port_id: "source_port_u1_14",
      source_component_id: "source_component_u1",
      pin_number: 14,
      name: "pin14",
      port_hints: ["pin14", "GP10", "GPIO10", "SPI1_SCK"],
    },
    {
      type: "source_component",
      ftype: "simple_resistor",
      source_component_id: "source_component_r1",
      name: "R1",
      display_resistance: "1kΩ",
      resistance: 1000,
    },
    {
      type: "source_port",
      source_port_id: "source_port_r1_1",
      source_component_id: "source_component_r1",
      pin_number: 1,
      name: "pin1",
      port_hints: ["pin1", "left"],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_1",
      connected_source_port_ids: ["source_port_u1_14", "source_port_r1_1"],
      connected_source_net_ids: [],
    },
  ] as AnyCircuitElement[]

  expect(
    convertCircuitJsonToReadableNetlist(circuitJson),
  ).toMatchInlineSnapshot(`
    "COMPONENTS:
     - U1: RP2040
     - R1: 1kΩ resistor

    NET: U1_SPI1_SCK
      - U1 pin14 (GP10,GPIO10,SPI1_SCK)
      - R1 pin1


    COMPONENT_PINS:
    U1 (RP2040)
    - pin14(GP10, GPIO10, SPI1_SCK): NETS(U1_SPI1_SCK)

    R1 (1kΩ)
    - pin1(left): NETS(U1_SPI1_SCK)
    "
  `)
})
