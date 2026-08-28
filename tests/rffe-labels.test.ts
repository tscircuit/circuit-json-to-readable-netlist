import { expect, it } from "bun:test"
import type { AnyCircuitElement } from "circuit-json"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"

it("preserves MIPI RFFE labels on generic pins", () => {
  const circuitJson = [
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_1",
      name: "U1",
      manufacturer_part_number: "RFFE-CONTROLLER",
    },
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_2",
      name: "U2",
      manufacturer_part_number: "RF-FRONT-END",
    },
    {
      type: "source_port",
      source_port_id: "source_port_1",
      source_component_id: "source_component_1",
      name: "pin14",
      pin_number: 14,
      port_hints: ["RFFE_SCLK1"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_2",
      source_component_id: "source_component_2",
      name: "pin1",
      pin_number: 1,
      port_hints: ["RFFE_SDATA1"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_3",
      source_component_id: "source_component_1",
      name: "pin15",
      pin_number: 15,
      port_hints: ["MIPI_RFFE_SDATA1"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_4",
      source_component_id: "source_component_2",
      name: "pin2",
      pin_number: 2,
      port_hints: ["RFFE_VIO1"],
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

  expect(netlist).toContain("NET: U1_RFFE_SCLK1")
  expect(netlist).toContain("  - U1 pin14 (RFFE_SCLK1)")
  expect(netlist).toContain("  - U2 pin1 (RFFE_SDATA1)")
  expect(netlist).toContain("NET: U1_MIPI_RFFE_SDATA1")
  expect(netlist).toContain("  - U1 pin15 (MIPI_RFFE_SDATA1)")
  expect(netlist).toContain("  - U2 pin2 (RFFE_VIO1)")
  expect(netlist).toContain("- pin14(RFFE_SCLK1): NETS(U1_RFFE_SCLK1)")
  expect(netlist).toContain(
    "- pin15(MIPI_RFFE_SDATA1): NETS(U1_MIPI_RFFE_SDATA1)",
  )
})
