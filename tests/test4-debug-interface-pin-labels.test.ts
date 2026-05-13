import { expect, it } from "bun:test"
import type { AnyCircuitElement } from "circuit-json"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"

it("keeps SWD and JTAG debug pin aliases readable", () => {
  const circuitJson: AnyCircuitElement[] = [
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_debug_header",
      name: "J1",
      manufacturer_part_number: "DEBUG-HEADER",
    },
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_mcu",
      name: "U1",
      manufacturer_part_number: "STM32F103",
    },
    {
      type: "source_port",
      source_port_id: "source_port_swdio",
      source_component_id: "source_component_debug_header",
      name: "pin2",
      pin_number: 2,
      port_hints: ["2", "pin2", "SWDIO", "DEBUG_RESET"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_mcu_swdio",
      source_component_id: "source_component_mcu",
      name: "pin34",
      pin_number: 34,
      port_hints: ["34", "pin34", "GPIO_DEBUG"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_jtag_clock",
      source_component_id: "source_component_debug_header",
      name: "pin3",
      pin_number: 3,
      port_hints: ["3", "pin3", "JTAG_TCK", "TRACE_CLOCK"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_mcu_jtag_clock",
      source_component_id: "source_component_mcu",
      name: "pin35",
      pin_number: 35,
      port_hints: ["35", "pin35", "GPIO_TRACE"],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_swdio",
      connected_source_port_ids: ["source_port_swdio", "source_port_mcu_swdio"],
      connected_source_net_ids: [],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_jtag_clock",
      connected_source_port_ids: [
        "source_port_jtag_clock",
        "source_port_mcu_jtag_clock",
      ],
      connected_source_net_ids: [],
    },
  ]

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: J1_SWDIO")
  expect(netlist).toContain("  - J1 pin2 (SWDIO,DEBUG_RESET)")
  expect(netlist).toContain("NET: J1_JTAG_TCK")
  expect(netlist).toContain("  - J1 pin3 (JTAG_TCK,TRACE_CLOCK)")
  expect(netlist).not.toContain("undefined")
})
