import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"

declare module "bun:test" {
  interface Matchers<T = unknown> {
    toMatchInlineSnapshot(snapshot?: string | null): Promise<MatcherResult>
  }
}

it("preserves string pin numbers as readable pin labels", () => {
  const circuitJson = [
    {
      type: "source_component",
      source_component_id: "source_component_led1",
      name: "LED1",
      ftype: "simple_chip",
      manufacturer_part_number: "LED-RED",
    },
    {
      type: "source_port",
      source_port_id: "source_port_led1_a",
      source_component_id: "source_component_led1",
      pin_number: "A",
      port_hints: ["anode"],
    },
    {
      type: "source_component",
      source_component_id: "source_component_j1",
      name: "J1",
      ftype: "simple_chip",
      manufacturer_part_number: "TEST-JIG",
    },
    {
      type: "source_port",
      source_port_id: "source_port_j1_1",
      source_component_id: "source_component_j1",
      name: "TP1",
      pin_number: 1,
      port_hints: ["1"],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_1",
      connected_source_port_ids: ["source_port_led1_a", "source_port_j1_1"],
    },
  ]

  expect(
    convertCircuitJsonToReadableNetlist(circuitJson as any),
  ).toMatchInlineSnapshot(`
    "COMPONENTS:
     - LED1: LED-RED
     - J1: TEST-JIG

    NET: LED1_anode
      - LED1 A (+)
      - J1 TP1


    COMPONENT_PINS:
    LED1 (LED-RED)
    - A(anode): NETS(LED1_anode)

    J1 (TEST-JIG)
    - pin1(TP1): NETS(LED1_anode)
    "
  `)
})
