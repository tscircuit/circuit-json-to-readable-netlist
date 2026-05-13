import { expect, it } from "bun:test"
import type { AnyCircuitElement } from "circuit-json"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"

it("keeps PoE power pin aliases readable", () => {
  const circuitJson: AnyCircuitElement[] = [
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_poe",
      name: "U1",
      manufacturer_part_number: "TPS2375",
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
      source_port_id: "source_port_poe_detect",
      source_component_id: "source_component_poe",
      name: "pin3",
      pin_number: 3,
      port_hints: ["3", "pin3", "POE_DETECT", "POWER_OVER_ETHERNET"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_mcu_poe_detect",
      source_component_id: "source_component_mcu",
      name: "pin28",
      pin_number: 28,
      port_hints: ["28", "pin28", "GPIO_POE"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_isolated_power",
      source_component_id: "source_component_poe",
      name: "pin4",
      pin_number: 4,
      port_hints: ["4", "pin4", "ISOLATED_POWER", "DCDC_ENABLE"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_mcu_isolated_power",
      source_component_id: "source_component_mcu",
      name: "pin29",
      pin_number: 29,
      port_hints: ["29", "pin29", "GPIO_POWER"],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_poe_detect",
      connected_source_port_ids: [
        "source_port_poe_detect",
        "source_port_mcu_poe_detect",
      ],
      connected_source_net_ids: [],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_isolated_power",
      connected_source_port_ids: [
        "source_port_isolated_power",
        "source_port_mcu_isolated_power",
      ],
      connected_source_net_ids: [],
    },
  ]

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_POE_DETECT")
  expect(netlist).toContain("  - U1 pin3 (POE_DETECT,POWER_OVER_ETHERNET)")
  expect(netlist).toContain("NET: U1_ISOLATED_POWER")
  expect(netlist).toContain("  - U1 pin4 (ISOLATED_POWER,DCDC_ENABLE)")
  expect(netlist).not.toContain("undefined")
})
