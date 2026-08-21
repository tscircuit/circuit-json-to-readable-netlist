import { expect, it } from "bun:test"
import type { AnyCircuitElement } from "circuit-json"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"

declare module "bun:test" {
  interface Matchers<T = unknown> {
    toMatchInlineSnapshot(snapshot?: string | null): Promise<MatcherResult>
  }
}

it("detects connected ports without relying on source_port_id prefixes", () => {
  const circuitJson = [
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "chip_a",
      name: "U1",
      manufacturer_part_number: "MCU",
    },
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "chip_b",
      name: "U2",
      manufacturer_part_number: "SENSOR",
    },
    {
      type: "source_port",
      source_port_id: "u1-port-sda",
      source_component_id: "chip_a",
      name: "SDA",
      pin_number: 1,
      port_hints: ["SDA"],
    },
    {
      type: "source_port",
      source_port_id: "u2-port-data",
      source_component_id: "chip_b",
      name: "DATA",
      pin_number: 1,
      port_hints: ["DATA"],
    },
    {
      type: "source_trace",
      source_trace_id: "trace-between-custom-port-ids",
      connected_source_port_ids: ["u1-port-sda", "u2-port-data"],
      connected_source_net_ids: [],
    },
  ] as AnyCircuitElement[]

  expect(
    convertCircuitJsonToReadableNetlist(circuitJson),
  ).toMatchInlineSnapshot(`
    "COMPONENTS:
     - U1: MCU
     - U2: SENSOR

    NET: U1_SDA
      - U1 SDA
      - U2 DATA


    COMPONENT_PINS:
    U1 (MCU)
    - pin1(SDA): NETS(U1_SDA)

    U2 (SENSOR)
    - pin1(DATA): NETS(U1_SDA)
    "
  `)
})
