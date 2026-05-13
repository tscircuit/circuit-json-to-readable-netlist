import { expect, it } from "bun:test"
import type { AnyCircuitElement } from "circuit-json"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"

it("keeps USB connector pin aliases readable", () => {
  const circuitJson: AnyCircuitElement[] = [
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_usb",
      name: "J1",
      manufacturer_part_number: "USB-C",
    },
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_mcu",
      name: "U1",
      manufacturer_part_number: "RP2040",
    },
    {
      type: "source_port",
      source_port_id: "source_port_usb_dp",
      source_component_id: "source_component_usb",
      name: "pin3",
      pin_number: 3,
      port_hints: ["3", "pin3", "USB_D_PLUS", "USB_ID"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_mcu_dp",
      source_component_id: "source_component_mcu",
      name: "pin11",
      pin_number: 11,
      port_hints: ["11", "pin11", "GPIO_USB"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_usb_vbus",
      source_component_id: "source_component_usb",
      name: "pin8",
      pin_number: 8,
      port_hints: ["8", "pin8", "VBUS_SENSE", "USB_POWER_DELIVERY"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_mcu_vbus",
      source_component_id: "source_component_mcu",
      name: "pin12",
      pin_number: 12,
      port_hints: ["12", "pin12", "GPIO_VBUS"],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_usb_dp",
      connected_source_port_ids: ["source_port_usb_dp", "source_port_mcu_dp"],
      connected_source_net_ids: [],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_usb_vbus",
      connected_source_port_ids: [
        "source_port_usb_vbus",
        "source_port_mcu_vbus",
      ],
      connected_source_net_ids: [],
    },
  ]

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: J1_USB_D_PLUS")
  expect(netlist).toContain("  - J1 pin3 (USB_D_PLUS,USB_ID)")
  expect(netlist).toContain("NET: J1_USB_POWER_DELIVERY")
  expect(netlist).toContain("  - J1 pin8 (VBUS_SENSE,USB_POWER_DELIVERY)")
  expect(netlist).not.toContain("undefined")
})
