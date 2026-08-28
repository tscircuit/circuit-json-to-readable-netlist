import { expect, it } from "bun:test"
import type { AnyCircuitElement } from "circuit-json"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"

it("uses named source groups for unnamed source net fallback names", () => {
  const circuitJson = [
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_1",
      name: "U1",
      manufacturer_part_number: "MCU",
    },
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_2",
      name: "J1",
      manufacturer_part_number: "CONN",
    },
    {
      type: "source_port",
      source_port_id: "source_port_1",
      source_component_id: "source_component_1",
      name: "pin14",
      pin_number: 14,
      port_hints: ["pin14"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_2",
      source_component_id: "source_component_2",
      name: "pin1",
      pin_number: 1,
      port_hints: ["pin1"],
    },
    {
      type: "source_group",
      source_group_id: "source_group_usb",
      name: "USB",
    },
    {
      type: "source_net",
      source_net_id: "source_net_1",
      name: "",
      member_source_group_ids: ["source_group_usb"],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_1",
      connected_source_port_ids: ["source_port_1", "source_port_2"],
      connected_source_net_ids: ["source_net_1"],
    },
  ] as AnyCircuitElement[]

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toBe(`COMPONENTS:
 - U1: MCU
 - J1: CONN

NET: USB
  - U1 pin14
  - J1 pin1


COMPONENT_PINS:
U1 (MCU)
- pin14: NETS(USB)

J1 (CONN)
- pin1: NETS(USB)
`)
})
