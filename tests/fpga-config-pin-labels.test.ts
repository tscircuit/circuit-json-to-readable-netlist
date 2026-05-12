import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"

const sourcePort = ({
  id,
  componentId,
  name,
  pinNumber,
  hints,
}: {
  id: string
  componentId: string
  name: string
  pinNumber: number
  hints: string[]
}) => ({
  type: "source_port",
  source_port_id: id,
  source_component_id: componentId,
  name,
  pin_number: pinNumber,
  port_hints: hints,
})

it("keeps FPGA configuration aliases above generic pin labels", () => {
  const circuitJson = [
    {
      type: "source_component",
      source_component_id: "source_component_1",
      name: "U1",
      ftype: "simple_chip",
      manufacturer_part_number: "XC7A35T",
    },
    {
      type: "source_component",
      source_component_id: "source_component_2",
      name: "J1",
      ftype: "simple_chip",
      manufacturer_part_number: "JTAG_HEADER",
    },
    {
      type: "source_component",
      source_component_id: "source_component_3",
      name: "SW1",
      ftype: "simple_chip",
      manufacturer_part_number: "DIP_SWITCH",
    },
    sourcePort({
      id: "source_port_1",
      componentId: "source_component_1",
      name: "pin14",
      pinNumber: 14,
      hints: ["PROGRAM_B"],
    }),
    sourcePort({
      id: "source_port_2",
      componentId: "source_component_2",
      name: "pin1",
      pinNumber: 1,
      hints: ["PROG"],
    }),
    sourcePort({
      id: "source_port_3",
      componentId: "source_component_1",
      name: "pin15",
      pinNumber: 15,
      hints: ["MSEL0"],
    }),
    sourcePort({
      id: "source_port_4",
      componentId: "source_component_3",
      name: "pin1",
      pinNumber: 1,
      hints: ["MODE"],
    }),
    sourcePort({
      id: "source_port_5",
      componentId: "source_component_1",
      name: "pin16",
      pinNumber: 16,
      hints: ["CONF_DONE"],
    }),
    sourcePort({
      id: "source_port_6",
      componentId: "source_component_2",
      name: "pin2",
      pinNumber: 2,
      hints: ["DONE_LED"],
    }),
    sourcePort({
      id: "source_port_7",
      componentId: "source_component_1",
      name: "pin17",
      pinNumber: 17,
      hints: ["NSTATUS"],
    }),
    sourcePort({
      id: "source_port_8",
      componentId: "source_component_2",
      name: "pin3",
      pinNumber: 3,
      hints: ["STATUS"],
    }),
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
    {
      type: "source_trace",
      source_trace_id: "source_trace_3",
      connected_source_port_ids: ["source_port_5", "source_port_6"],
      connected_source_net_ids: [],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_4",
      connected_source_port_ids: ["source_port_7", "source_port_8"],
      connected_source_net_ids: [],
    },
  ]

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson as any)

  expect(netlist).toContain("NET: U1_PROGRAM_B")
  expect(netlist).toContain("  - U1 pin14 (PROGRAM_B)")
  expect(netlist).toContain("NET: U1_MSEL0")
  expect(netlist).toContain("  - U1 pin15 (MSEL0)")
  expect(netlist).toContain("  - SW1 pin1")
  expect(netlist).toContain("NET: U1_CONF_DONE")
  expect(netlist).toContain("  - U1 pin16 (CONF_DONE)")
  expect(netlist).toContain("NET: U1_NSTATUS")
  expect(netlist).toContain("- pin17(NSTATUS): NETS(U1_NSTATUS)")
})
