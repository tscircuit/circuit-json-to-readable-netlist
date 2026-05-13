import { expect, it } from "bun:test"
import type { AnyCircuitElement } from "circuit-json"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"

it("keeps cellular modem pin aliases readable", () => {
  const circuitJson: AnyCircuitElement[] = [
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_modem",
      name: "U1",
      manufacturer_part_number: "SIM7600G",
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
      source_port_id: "source_port_modem_powerkey",
      source_component_id: "source_component_modem",
      name: "pin6",
      pin_number: 6,
      port_hints: ["6", "pin6", "MODEM_POWERKEY", "CELLULAR_WAKE"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_mcu_modem_powerkey",
      source_component_id: "source_component_mcu",
      name: "pin15",
      pin_number: 15,
      port_hints: ["15", "pin15", "GPIO_MODEM_POWER"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_network_status",
      source_component_id: "source_component_modem",
      name: "pin7",
      pin_number: 7,
      port_hints: ["7", "pin7", "NETWORK_STATUS", "MODEM_STATUS"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_mcu_network_status",
      source_component_id: "source_component_mcu",
      name: "pin16",
      pin_number: 16,
      port_hints: ["16", "pin16", "GPIO_NETWORK"],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_modem_powerkey",
      connected_source_port_ids: [
        "source_port_modem_powerkey",
        "source_port_mcu_modem_powerkey",
      ],
      connected_source_net_ids: [],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_network_status",
      connected_source_port_ids: [
        "source_port_network_status",
        "source_port_mcu_network_status",
      ],
      connected_source_net_ids: [],
    },
  ]

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_MODEM_POWERKEY")
  expect(netlist).toContain("  - U1 pin6 (MODEM_POWERKEY,CELLULAR_WAKE)")
  expect(netlist).toContain("NET: U1_NETWORK_STATUS")
  expect(netlist).toContain("  - U1 pin7 (NETWORK_STATUS,MODEM_STATUS)")
  expect(netlist).not.toContain("undefined")
})
