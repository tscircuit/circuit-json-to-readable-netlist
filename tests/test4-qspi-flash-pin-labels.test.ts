import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"

it("keeps QSPI flash aliases above generic pin labels", () => {
  const circuitJson = [
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_u1",
      name: "U1",
      manufacturer_part_number: "MCU_WITH_QSPI",
    },
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_u2",
      name: "U2",
      manufacturer_part_number: "SPI_FLASH",
    },
    {
      type: "source_port",
      source_port_id: "source_port_u1_io0",
      source_component_id: "source_component_u1",
      name: "pin14",
      pin_number: 14,
      port_hints: ["QSPI_IO0"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_u1_io1",
      source_component_id: "source_component_u1",
      name: "pin15",
      pin_number: 15,
      port_hints: ["QSPI_IO1"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_u1_wp",
      source_component_id: "source_component_u1",
      name: "pin16",
      pin_number: 16,
      port_hints: ["QSPI_WP_N"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_u1_hold",
      source_component_id: "source_component_u1",
      name: "pin17",
      pin_number: 17,
      port_hints: ["QSPI_HOLD_N"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_u2_io0",
      source_component_id: "source_component_u2",
      name: "pin5",
      pin_number: 5,
      port_hints: ["IO0"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_u2_io1",
      source_component_id: "source_component_u2",
      name: "pin2",
      pin_number: 2,
      port_hints: ["IO1"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_u2_wp",
      source_component_id: "source_component_u2",
      name: "pin3",
      pin_number: 3,
      port_hints: ["WP_N"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_u2_hold",
      source_component_id: "source_component_u2",
      name: "pin7",
      pin_number: 7,
      port_hints: ["HOLD_N"],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_io0",
      connected_source_port_ids: ["source_port_u1_io0", "source_port_u2_io0"],
      connected_source_net_ids: [],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_io1",
      connected_source_port_ids: ["source_port_u1_io1", "source_port_u2_io1"],
      connected_source_net_ids: [],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_wp",
      connected_source_port_ids: ["source_port_u1_wp", "source_port_u2_wp"],
      connected_source_net_ids: [],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_hold",
      connected_source_port_ids: ["source_port_u1_hold", "source_port_u2_hold"],
      connected_source_net_ids: [],
    },
  ]

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson as any)

  expect(netlist).toContain("NET: U1_QSPI_IO0")
  expect(netlist).toContain("  - U1 pin14 (QSPI_IO0)")
  expect(netlist).toContain("  - U2 pin5 (IO0)")
  expect(netlist).toContain("- pin14(QSPI_IO0): NETS(U1_QSPI_IO0)")

  expect(netlist).toContain("NET: U1_QSPI_IO1")
  expect(netlist).toContain("  - U1 pin15 (QSPI_IO1)")
  expect(netlist).toContain("  - U2 pin2 (IO1)")

  expect(netlist).toContain("NET: U1_QSPI_WP_N")
  expect(netlist).toContain("  - U1 pin16 (QSPI_WP_N)")
  expect(netlist).toContain("  - U2 pin3 (WP_N)")

  expect(netlist).toContain("NET: U1_QSPI_HOLD_N")
  expect(netlist).toContain("  - U1 pin17 (QSPI_HOLD_N)")
  expect(netlist).toContain("  - U2 pin7 (HOLD_N)")
})
