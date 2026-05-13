import { expect, it } from "bun:test"
import type { AnyCircuitElement } from "circuit-json"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"

it("keeps proximity and ambient-light sensor aliases readable", () => {
  const circuitJson: AnyCircuitElement[] = [
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_light_sensor",
      name: "U1",
      manufacturer_part_number: "APDS9960",
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
      source_port_id: "source_port_ambient_light",
      source_component_id: "source_component_light_sensor",
      name: "pin4",
      pin_number: 4,
      port_hints: ["4", "pin4", "AMBIENT_LIGHT", "LUX_READY"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_mcu_ambient_light",
      source_component_id: "source_component_mcu",
      name: "pin20",
      pin_number: 20,
      port_hints: ["20", "pin20", "GPIO_LIGHT"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_proximity",
      source_component_id: "source_component_light_sensor",
      name: "pin5",
      pin_number: 5,
      port_hints: ["5", "pin5", "PROXIMITY_ALERT", "GESTURE_INT"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_mcu_proximity",
      source_component_id: "source_component_mcu",
      name: "pin21",
      pin_number: 21,
      port_hints: ["21", "pin21", "GPIO_ALERT"],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_ambient_light",
      connected_source_port_ids: [
        "source_port_ambient_light",
        "source_port_mcu_ambient_light",
      ],
      connected_source_net_ids: [],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_proximity",
      connected_source_port_ids: [
        "source_port_proximity",
        "source_port_mcu_proximity",
      ],
      connected_source_net_ids: [],
    },
  ]

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_AMBIENT_LIGHT")
  expect(netlist).toContain("  - U1 pin4 (AMBIENT_LIGHT,LUX_READY)")
  expect(netlist).toContain("NET: U1_PROXIMITY_ALERT")
  expect(netlist).toContain("  - U1 pin5 (PROXIMITY_ALERT,GESTURE_INT)")
  expect(netlist).not.toContain("undefined")
})
