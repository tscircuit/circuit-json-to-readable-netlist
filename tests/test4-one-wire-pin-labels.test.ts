import { expect, it } from "bun:test"
import type { AnyCircuitElement } from "circuit-json"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { scorePhrase } from "lib/scorePhrase"

declare module "bun:test" {
  interface Matchers<T = unknown> {
    toMatchInlineSnapshot(snapshot?: string | null): Promise<MatcherResult>
  }
}

it("preserves 1-Wire and Dallas sensor pin labels before numeric fallback", () => {
  expect(scorePhrase("1WIRE_DQ1")).toBeGreaterThan(scorePhrase("pin1"))
  expect(scorePhrase("DS18B20_DQ1")).toBeGreaterThan(scorePhrase("pin2"))

  const circuitJson = [
    {
      type: "source_component",
      source_component_id: "source_component_1",
      ftype: "simple_chip",
      name: "U1",
      manufacturer_part_number: "DS2482-100",
    },
    {
      type: "source_component",
      source_component_id: "source_component_2",
      ftype: "simple_chip",
      name: "U2",
      manufacturer_part_number: "DS18B20",
    },
    {
      type: "source_port",
      source_port_id: "source_port_1",
      source_component_id: "source_component_1",
      name: "pin1",
      pin_number: 1,
      port_hints: ["1WIRE_DQ1", "DQ"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_2",
      source_component_id: "source_component_2",
      name: "pin2",
      pin_number: 2,
      port_hints: ["DS18B20_DQ1"],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_1",
      connected_source_port_ids: ["source_port_1", "source_port_2"],
      connected_source_net_ids: [],
    },
  ] as AnyCircuitElement[]

  expect(
    convertCircuitJsonToReadableNetlist(circuitJson),
  ).toMatchInlineSnapshot(`
    "COMPONENTS:
     - U1: DS2482-100
     - U2: DS18B20

    NET: U1_1WIRE_DQ1
      - U1 pin1 (1WIRE_DQ1,DQ)
      - U2 pin2 (DS18B20_DQ1)


    COMPONENT_PINS:
    U1 (DS2482-100)
    - pin1(1WIRE_DQ1, DQ): NETS(U1_1WIRE_DQ1)

    U2 (DS18B20)
    - pin2(DS18B20_DQ1): NETS(U1_1WIRE_DQ1)
    "
  `)
})
