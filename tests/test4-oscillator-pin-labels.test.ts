import { expect, it } from "bun:test"
import type { AnyCircuitElement } from "circuit-json"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"

it("keeps crystal and oscillator aliases readable", () => {
  const circuitJson: AnyCircuitElement[] = [
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_mcu",
      name: "U1",
      manufacturer_part_number: "STM32",
    },
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_oscillator",
      name: "Y1",
      manufacturer_part_number: "TCXO",
    },
    {
      type: "source_port",
      source_port_id: "source_port_mcu_xtal",
      source_component_id: "source_component_mcu",
      name: "pin5",
      pin_number: 5,
      port_hints: ["5", "pin5", "XTAL_IN"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_osc_xtal",
      source_component_id: "source_component_oscillator",
      name: "pin1",
      pin_number: 1,
      port_hints: ["1", "pin1", "CRYSTAL_OUT"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_mcu_osc",
      source_component_id: "source_component_mcu",
      name: "pin6",
      pin_number: 6,
      port_hints: ["6", "pin6", "OSC_IN"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_osc_clock",
      source_component_id: "source_component_oscillator",
      name: "pin3",
      pin_number: 3,
      port_hints: ["3", "pin3", "TCXO_OUT"],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_xtal",
      connected_source_port_ids: [
        "source_port_mcu_xtal",
        "source_port_osc_xtal",
      ],
      connected_source_net_ids: [],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_osc",
      connected_source_port_ids: [
        "source_port_mcu_osc",
        "source_port_osc_clock",
      ],
      connected_source_net_ids: [],
    },
  ]

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_XTAL_IN")
  expect(netlist).toContain("  - U1 pin5 (XTAL_IN)")
  expect(netlist).toContain("NET: Y1_TCXO_OUT")
  expect(netlist).toContain("  - Y1 pin3 (TCXO_OUT)")
  expect(netlist).not.toContain("undefined")
})
