import { expect, it } from "bun:test"
import type { AnyCircuitElement } from "circuit-json"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"

it("keeps model railroad control aliases on generic chip pins", () => {
  const circuitJson = [
    {
      type: "source_component",
      source_component_id: "source_component_0",
      ftype: "simple_chip",
      name: "U1",
      manufacturer_part_number: "DCC-DECODER",
    },
    {
      type: "source_port",
      source_port_id: "source_port_0",
      name: "pin14",
      pin_number: 14,
      port_hints: ["DCC_RAIL1", "pin14", "14"],
      source_component_id: "source_component_0",
    },
    {
      type: "source_port",
      source_port_id: "source_port_1",
      name: "pin15",
      pin_number: 15,
      port_hints: ["LOCONET_TX1", "pin15", "15"],
      source_component_id: "source_component_0",
    },
    {
      type: "source_component",
      source_component_id: "source_component_1",
      ftype: "simple_resistor",
      name: "R1",
      display_resistance: "1kΩ",
    },
    {
      type: "source_port",
      source_port_id: "source_port_2",
      name: "pin1",
      pin_number: 1,
      port_hints: ["anode", "pos", "pin1", "1"],
      source_component_id: "source_component_1",
    },
    {
      type: "source_port",
      source_port_id: "source_port_3",
      name: "pin2",
      pin_number: 2,
      port_hints: ["cathode", "neg", "pin2", "2"],
      source_component_id: "source_component_1",
    },
    {
      type: "cad_component",
      cad_component_id: "cad_component_0",
      source_component_id: "source_component_1",
      footprinter_string: "0402",
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_0",
      connected_source_port_ids: ["source_port_0", "source_port_2"],
      connected_source_net_ids: [],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_1",
      connected_source_port_ids: ["source_port_1", "source_port_3"],
      connected_source_net_ids: [],
    },
  ] as AnyCircuitElement[]

  const readableNetlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(readableNetlist).toContain("NET: U1_DCC_RAIL1")
  expect(readableNetlist).toContain("  - U1 pin14 (DCC_RAIL1)")
  expect(readableNetlist).toContain("- pin14(DCC_RAIL1): NETS(U1_DCC_RAIL1)")

  expect(readableNetlist).toContain("NET: U1_LOCONET_TX1")
  expect(readableNetlist).toContain("  - U1 pin15 (LOCONET_TX1)")
  expect(readableNetlist).toContain(
    "- pin15(LOCONET_TX1): NETS(U1_LOCONET_TX1)",
  )
})
