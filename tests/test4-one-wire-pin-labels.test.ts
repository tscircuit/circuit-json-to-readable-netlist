import { expect, test } from "bun:test"
import type { AnyCircuitElement } from "circuit-json"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { scorePhrase } from "lib/scorePhrase"

test("1-Wire aliases score above generic numbered pins", () => {
  for (const alias of ["1WIRE_DQ", "ONEWIRE", "1W_DQ", "OW_IO", "DQ"]) {
    expect(scorePhrase(alias)).toBeGreaterThan(1)
  }
  expect(scorePhrase("pin14")).toBe(0.5)
})

test("keeps 1-Wire data aliases for generic numbered chip pins", () => {
  const circuitJson: AnyCircuitElement[] = [
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_sensor",
      name: "U1",
      manufacturer_part_number: "DS18B20",
    } as any,
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_controller",
      name: "U2",
      manufacturer_part_number: "MCU",
    } as any,
    {
      type: "source_port",
      source_port_id: "source_port_sensor_dq",
      source_component_id: "source_component_sensor",
      name: "pin2",
      pin_number: 2,
      port_hints: ["1WIRE_DQ"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_controller_dq",
      source_component_id: "source_component_controller",
      name: "pin14",
      pin_number: 14,
      port_hints: ["OW_IO"],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_one_wire",
      connected_source_port_ids: [
        "source_port_sensor_dq",
        "source_port_controller_dq",
      ],
      connected_source_net_ids: [],
    },
  ]

  expect(
    convertCircuitJsonToReadableNetlist(circuitJson),
  ).toMatchInlineSnapshot(`
    "COMPONENTS:
     - U1: DS18B20
     - U2: MCU

    NET: U1_1WIRE_DQ
      - U1 pin2 (1WIRE_DQ)
      - U2 pin14 (OW_IO)


    COMPONENT_PINS:
    U1 (DS18B20)
    - pin2(1WIRE_DQ): NETS(U1_1WIRE_DQ)

    U2 (MCU)
    - pin14(OW_IO): NETS(U1_1WIRE_DQ)
    "
  `)
})
