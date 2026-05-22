import { expect, it } from "bun:test"
import type { AnyCircuitElement } from "circuit-json"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"

it("preserves GPIB instrument-bus labels on generic pins", () => {
  const circuitJson = [
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_1",
      name: "U1",
      manufacturer_part_number: "TNT4882",
    },
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_2",
      name: "J1",
      manufacturer_part_number: "IEEE-488-CONN",
    },
    {
      type: "source_port",
      source_port_id: "source_port_1",
      source_component_id: "source_component_1",
      name: "pin14",
      pin_number: 14,
      port_hints: ["GPIB_DIO1"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_2",
      source_component_id: "source_component_2",
      name: "pin1",
      pin_number: 1,
      port_hints: ["IEEE488_DIO1"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_3",
      source_component_id: "source_component_1",
      name: "pin15",
      pin_number: 15,
      port_hints: ["HPIB_ATN1"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_4",
      source_component_id: "source_component_2",
      name: "pin2",
      pin_number: 2,
      port_hints: ["HP_IB_ATN1"],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_1",
      connected_source_port_ids: ["source_port_1", "source_port_2"],
      connected_source_net_ids: [],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_2",
      connected_source_port_ids: ["source_port_3", "source_port_4"],
      connected_source_net_ids: [],
    },
  ] as AnyCircuitElement[]

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_GPIB_DIO1")
  expect(netlist).toContain("  - U1 pin14 (GPIB_DIO1)")
  expect(netlist).toContain("  - J1 pin1 (IEEE488_DIO1)")
  expect(netlist).toContain("NET: U1_HPIB_ATN1")
  expect(netlist).toContain("  - U1 pin15 (HPIB_ATN1)")
  expect(netlist).toContain("  - J1 pin2 (HP_IB_ATN1)")
  expect(netlist).toContain("- pin14(GPIB_DIO1): NETS(U1_GPIB_DIO1)")
  expect(netlist).toContain("- pin15(HPIB_ATN1): NETS(U1_HPIB_ATN1)")
})
