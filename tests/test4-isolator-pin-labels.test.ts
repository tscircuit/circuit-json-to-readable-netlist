import { expect, it } from "bun:test"
import type { AnyCircuitElement } from "circuit-json"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"

it("keeps optocoupler and isolated-signal aliases readable", () => {
  const circuitJson: AnyCircuitElement[] = [
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_isolator",
      name: "U1",
      manufacturer_part_number: "PC817",
    },
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_mcu",
      name: "U2",
      manufacturer_part_number: "ESP32",
    },
    {
      type: "source_port",
      source_port_id: "source_port_opto_input",
      source_component_id: "source_component_isolator",
      name: "pin1",
      pin_number: 1,
      port_hints: ["1", "pin1", "OPTO_IN", "LED_INPUT"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_mcu_opto_input",
      source_component_id: "source_component_mcu",
      name: "pin18",
      pin_number: 18,
      port_hints: ["18", "pin18", "GPIO_DRIVE"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_isolated_signal",
      source_component_id: "source_component_isolator",
      name: "pin4",
      pin_number: 4,
      port_hints: ["4", "pin4", "ISOLATED_SIGNAL", "OPTO_OUT"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_mcu_isolated_signal",
      source_component_id: "source_component_mcu",
      name: "pin19",
      pin_number: 19,
      port_hints: ["19", "pin19", "GPIO_STATUS"],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_opto_input",
      connected_source_port_ids: [
        "source_port_opto_input",
        "source_port_mcu_opto_input",
      ],
      connected_source_net_ids: [],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_isolated_signal",
      connected_source_port_ids: [
        "source_port_isolated_signal",
        "source_port_mcu_isolated_signal",
      ],
      connected_source_net_ids: [],
    },
  ]

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_OPTO_IN")
  expect(netlist).toContain("  - U1 pin1 (OPTO_IN,LED_INPUT)")
  expect(netlist).toContain("NET: U1_ISOLATED_SIGNAL")
  expect(netlist).toContain("  - U1 pin4 (ISOLATED_SIGNAL,OPTO_OUT)")
  expect(netlist).not.toContain("undefined")
})
