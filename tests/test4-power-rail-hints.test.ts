import { expect, it } from "bun:test"
import type { AnyCircuitElement } from "circuit-json"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { scorePhrase } from "lib/scorePhrase"

it("scores known digit-bearing power and GPIO labels before generic digit fallback", () => {
  expect(scorePhrase("V3")).toBeGreaterThan(scorePhrase("pos"))
  expect(scorePhrase("GPIO0")).toBeGreaterThan(scorePhrase("pin1"))
})

it("uses descriptive power rail hints instead of generic polarity labels", () => {
  const circuitJson: AnyCircuitElement[] = [
    {
      type: "source_component",
      source_component_id: "source_component_0",
      ftype: "simple_chip",
      name: "U1",
      manufacturer_part_number: "MCU",
    },
    {
      type: "source_port",
      source_port_id: "source_port_0",
      source_component_id: "source_component_0",
      name: "pin1",
      pin_number: 1,
      port_hints: ["V3", "pos", "pin1", "1"],
    },
    {
      type: "source_component",
      source_component_id: "source_component_1",
      ftype: "simple_chip",
      name: "U2",
      manufacturer_part_number: "SENSOR",
    },
    {
      type: "source_port",
      source_port_id: "source_port_1",
      source_component_id: "source_component_1",
      name: "pin2",
      pin_number: 2,
      port_hints: ["pos", "pin2", "2"],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_0",
      connected_source_port_ids: ["source_port_0", "source_port_1"],
      connected_source_net_ids: [],
    },
  ]

  expect(
    convertCircuitJsonToReadableNetlist(circuitJson),
  ).toMatchInlineSnapshot(`
    "COMPONENTS:
     - U1: MCU
     - U2: SENSOR

    NET: U1_V3
      - U1 pin1 (+,V3)
      - U2 pin2 (+)


    COMPONENT_PINS:
    U1 (MCU)
    - pin1(V3, pos): NETS(U1_V3)

    U2 (SENSOR)
    - pin2(pos): NETS(U1_V3)
    "
  `)
})
