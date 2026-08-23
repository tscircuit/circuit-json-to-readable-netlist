import { expect, test } from "bun:test"
import type { AnyCircuitElement } from "circuit-json"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { scorePhrase } from "lib/scorePhrase"

test("memory bus aliases score above generic numbered pins", () => {
  for (const alias of ["CE", "OE", "WE", "WP", "HOLD", "ALE", "CLE", "DQS"]) {
    expect(scorePhrase(alias)).toBeGreaterThan(1)
  }
  expect(scorePhrase("pin14")).toBe(0.5)
})

test("memory bus control aliases are readable on generic pins", () => {
  const circuitJson: AnyCircuitElement[] = [
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_flash",
      name: "U1",
    },
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_mcu",
      name: "U2",
    },
    {
      type: "source_port",
      source_port_id: "source_port_flash_ce",
      source_component_id: "source_component_flash",
      name: "pin1",
      pin_number: 1,
      port_hints: ["CE"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_mcu_ce",
      source_component_id: "source_component_mcu",
      name: "pin14",
      pin_number: 14,
      port_hints: ["CE"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_flash_we",
      source_component_id: "source_component_flash",
      name: "pin2",
      pin_number: 2,
      port_hints: ["WE"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_mcu_we",
      source_component_id: "source_component_mcu",
      name: "pin15",
      pin_number: 15,
      port_hints: ["WE"],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_ce",
      connected_source_port_ids: ["source_port_flash_ce", "source_port_mcu_ce"],
      connected_source_net_ids: [],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_we",
      connected_source_port_ids: ["source_port_flash_we", "source_port_mcu_we"],
      connected_source_net_ids: [],
    },
  ]

  expect(
    convertCircuitJsonToReadableNetlist(circuitJson),
  ).toMatchInlineSnapshot(`
      "COMPONENTS:
       - U1: 
       - U2: 

      NET: U1_CE
        - U1 pin1 (CE)
        - U2 pin14 (CE)

      NET: U1_WE
        - U1 pin2 (WE)
        - U2 pin15 (WE)


      COMPONENT_PINS:
      U1
      - pin1(CE): NETS(U1_CE)
      - pin2(WE): NETS(U1_WE)

      U2
      - pin14(CE): NETS(U1_CE)
      - pin15(WE): NETS(U1_WE)
      "
    `)
})
