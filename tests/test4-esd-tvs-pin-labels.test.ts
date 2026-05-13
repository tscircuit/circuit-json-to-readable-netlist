import { expect, it } from "bun:test"
import type { AnyCircuitElement } from "circuit-json"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"

it("keeps ESD and TVS protection aliases readable", () => {
  const circuitJson: AnyCircuitElement[] = [
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_protector",
      name: "U1",
      manufacturer_part_number: "USBLC6",
    },
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_connector",
      name: "J1",
      manufacturer_part_number: "USB-C",
    },
    {
      type: "source_port",
      source_port_id: "source_port_esd",
      source_component_id: "source_component_protector",
      name: "pin2",
      pin_number: 2,
      port_hints: ["2", "pin2", "ESD_PROTECT"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_connector_esd",
      source_component_id: "source_component_connector",
      name: "pin5",
      pin_number: 5,
      port_hints: ["5", "pin5", "D+"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_tvs",
      source_component_id: "source_component_protector",
      name: "pin3",
      pin_number: 3,
      port_hints: ["3", "pin3", "TVS_CLAMP"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_connector_tvs",
      source_component_id: "source_component_connector",
      name: "pin6",
      pin_number: 6,
      port_hints: ["6", "pin6", "D-"],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_esd",
      connected_source_port_ids: [
        "source_port_esd",
        "source_port_connector_esd",
      ],
      connected_source_net_ids: [],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_tvs",
      connected_source_port_ids: [
        "source_port_tvs",
        "source_port_connector_tvs",
      ],
      connected_source_net_ids: [],
    },
  ]

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_ESD_PROTECT")
  expect(netlist).toContain("  - U1 pin2 (ESD_PROTECT)")
  expect(netlist).toContain("NET: U1_TVS_CLAMP")
  expect(netlist).toContain("  - U1 pin3 (TVS_CLAMP)")
  expect(netlist).not.toContain("undefined")
})
