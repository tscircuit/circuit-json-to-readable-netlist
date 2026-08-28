import { expect, it } from "bun:test"
import type { AnyCircuitElement } from "circuit-json"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"

declare module "bun:test" {
  interface Matchers<T = unknown> {
    toMatchInlineSnapshot(snapshot?: string | null): Promise<MatcherResult>
  }
}

it("includes all explicit source net names in component pin net lists", () => {
  const circuitJson = [
    {
      type: "source_component",
      source_component_id: "source_component_1",
      name: "U1",
      ftype: "simple_chip",
    },
    {
      type: "source_component",
      source_component_id: "source_component_2",
      name: "U2",
      ftype: "simple_chip",
    },
    {
      type: "source_port",
      source_port_id: "source_port_1",
      source_component_id: "source_component_1",
      pin_number: 1,
      name: "VDD",
    },
    {
      type: "source_port",
      source_port_id: "source_port_2",
      source_component_id: "source_component_2",
      pin_number: 1,
      name: "VIN",
    },
    {
      type: "source_net",
      source_net_id: "source_net_vcc",
      name: "VCC",
    },
    {
      type: "source_net",
      source_net_id: "source_net_5v",
      name: "5V",
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_1",
      connected_source_port_ids: ["source_port_1", "source_port_2"],
      connected_source_net_ids: ["source_net_vcc", "source_net_5v"],
    },
  ] as AnyCircuitElement[]

  expect(
    convertCircuitJsonToReadableNetlist(circuitJson),
  ).toMatchInlineSnapshot(`
      "COMPONENTS:
       - U1: 
       - U2: 

      NET: VCC
        - U1 VDD
        - U2 VIN


      COMPONENT_PINS:
      U1
      - pin1(VDD): NETS(VCC, 5V)

      U2
      - pin1(VIN): NETS(VCC, 5V)
      "
    `)
})
