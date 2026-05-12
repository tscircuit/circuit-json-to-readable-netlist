import { expect, it } from "bun:test"
import type { AnyCircuitElement } from "circuit-json"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"

it("keeps descriptive labels for generic chip pins and omits undefined footprints", () => {
  const circuitJson: AnyCircuitElement[] = [
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_1",
      name: "U1",
      manufacturer_part_number: "RP2040",
    },
    {
      type: "source_port",
      source_port_id: "source_port_1",
      source_component_id: "source_component_1",
      name: "pin14",
      pin_number: 14,
      port_hints: ["pin14", "GPIO10", "SCL"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_2",
      source_component_id: "source_component_1",
      name: "pin15",
      pin_number: 15,
      port_hints: ["pin15", "GPIO11", "SDA"],
    },
    {
      type: "source_component",
      ftype: "simple_resistor",
      source_component_id: "source_component_2",
      name: "R1",
      resistance: 1000,
      display_resistance: "1kΩ",
    },
    {
      type: "source_port",
      source_port_id: "source_port_3",
      source_component_id: "source_component_2",
      name: "pin1",
      pin_number: 1,
      port_hints: ["pin1", "anode", "pos", "left"],
    },
    {
      type: "source_net",
      source_net_id: "source_net_1",
      name: "I2C_SCL",
      member_source_group_ids: [],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_1",
      connected_source_port_ids: [
        "source_port_1",
        "source_port_2",
        "source_port_3",
      ],
      connected_source_net_ids: ["source_net_1"],
    },
  ]

  expect(convertCircuitJsonToReadableNetlist(circuitJson)).toBe(`COMPONENTS:
 - U1: RP2040
 - R1: 1kΩ resistor

NET: I2C_SCL
  - U1 pin14 (GPIO10,SCL)
  - U1 pin15 (GPIO11,SDA)
  - R1 pin1


COMPONENT_PINS:
U1 (RP2040)
- pin14(GPIO10, SCL): NETS(I2C_SCL)
- pin15(GPIO11, SDA): NETS(I2C_SCL)

R1 (1kΩ)
- pin1(anode, pos, left): NETS(I2C_SCL)
`)
})
