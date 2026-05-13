import { expect, it } from "bun:test"
import type { AnyCircuitElement } from "circuit-json"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"

it("keeps Ethernet PHY pin aliases readable", () => {
  const circuitJson: AnyCircuitElement[] = [
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_phy",
      name: "U1",
      manufacturer_part_number: "LAN8720A",
    },
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_mcu",
      name: "U2",
      manufacturer_part_number: "STM32F407",
    },
    {
      type: "source_port",
      source_port_id: "source_port_phy_reset",
      source_component_id: "source_component_phy",
      name: "pin7",
      pin_number: 7,
      port_hints: ["7", "pin7", "PHY_RESET", "LINK_STATUS"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_mcu_reset",
      source_component_id: "source_component_mcu",
      name: "pin21",
      pin_number: 21,
      port_hints: ["21", "pin21", "GPIO_RESET"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_mdio_data",
      source_component_id: "source_component_phy",
      name: "pin12",
      pin_number: 12,
      port_hints: ["12", "pin12", "MDIO_DATA", "MDC_CLOCK"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_mcu_mdio",
      source_component_id: "source_component_mcu",
      name: "pin22",
      pin_number: 22,
      port_hints: ["22", "pin22", "GPIO_MDIO"],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_phy_reset",
      connected_source_port_ids: [
        "source_port_phy_reset",
        "source_port_mcu_reset",
      ],
      connected_source_net_ids: [],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_mdio_data",
      connected_source_port_ids: [
        "source_port_mdio_data",
        "source_port_mcu_mdio",
      ],
      connected_source_net_ids: [],
    },
  ]

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_PHY_RESET")
  expect(netlist).toContain("  - U1 pin7 (PHY_RESET,LINK_STATUS)")
  expect(netlist).toContain("NET: U1_MDIO_DATA")
  expect(netlist).toContain("  - U1 pin12 (MDIO_DATA,MDC_CLOCK)")
  expect(netlist).not.toContain("undefined")
})
