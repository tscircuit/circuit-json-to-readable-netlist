import { expect, it } from "bun:test"
import type { AnyCircuitElement } from "circuit-json"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"

it("keeps clock sync and PLL pin aliases readable", () => {
  const circuitJson: AnyCircuitElement[] = [
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_clock",
      name: "U1",
      manufacturer_part_number: "SI5351",
    },
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_mcu",
      name: "U2",
      manufacturer_part_number: "RP2040",
    },
    {
      type: "source_port",
      source_port_id: "source_port_reference_clock",
      source_component_id: "source_component_clock",
      name: "pin4",
      pin_number: 4,
      port_hints: ["4", "pin4", "REFERENCE_CLOCK", "CLOCK_OUTPUT"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_mcu_reference_clock",
      source_component_id: "source_component_mcu",
      name: "pin10",
      pin_number: 10,
      port_hints: ["10", "pin10", "GPIO_CLOCK"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_sync_input",
      source_component_id: "source_component_clock",
      name: "pin5",
      pin_number: 5,
      port_hints: ["5", "pin5", "SYNC_INPUT", "PLL_LOCK"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_mcu_sync_input",
      source_component_id: "source_component_mcu",
      name: "pin11",
      pin_number: 11,
      port_hints: ["11", "pin11", "GPIO_SYNC"],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_reference_clock",
      connected_source_port_ids: [
        "source_port_reference_clock",
        "source_port_mcu_reference_clock",
      ],
      connected_source_net_ids: [],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_sync_input",
      connected_source_port_ids: [
        "source_port_sync_input",
        "source_port_mcu_sync_input",
      ],
      connected_source_net_ids: [],
    },
  ]

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_REFERENCE_CLOCK")
  expect(netlist).toContain("  - U1 pin4 (REFERENCE_CLOCK,CLOCK_OUTPUT)")
  expect(netlist).toContain("NET: U1_SYNC_INPUT")
  expect(netlist).toContain("  - U1 pin5 (SYNC_INPUT,PLL_LOCK)")
  expect(netlist).not.toContain("undefined")
})
