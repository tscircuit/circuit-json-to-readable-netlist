import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { scorePhrase } from "lib/scorePhrase"

it("prefers OctoSPI labels that include data lane numbers", () => {
  expect(scorePhrase("OCTOSPI_IO0")).toBeGreaterThan(scorePhrase("pos"))
  expect(scorePhrase("OSPI_DQ7")).toBeGreaterThan(scorePhrase("pos"))
  expect(scorePhrase("OPI_DQ0")).toBeGreaterThan(scorePhrase("pos"))
  expect(scorePhrase("topic1")).toBe(0.5)

  const circuitJson = [
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_0",
      name: "U1",
      manufacturer_part_number: "MX25UM51245G",
    },
    {
      type: "source_component",
      ftype: "simple_resistor",
      source_component_id: "source_component_1",
      name: "R1",
      display_resistance: "1k",
    },
    {
      type: "cad_component",
      cad_component_id: "cad_component_0",
      source_component_id: "source_component_1",
      footprinter_string: "0402",
    },
    {
      type: "source_port",
      source_port_id: "source_port_0",
      source_component_id: "source_component_0",
      name: "pin1",
      pin_number: 1,
      port_hints: ["OCTOSPI_IO0"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_1",
      source_component_id: "source_component_1",
      name: "pin1",
      pin_number: 1,
      port_hints: ["anode", "pos", "left"],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_0",
      connected_source_port_ids: ["source_port_0", "source_port_1"],
      connected_source_net_ids: [],
    },
  ] as any

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_OCTOSPI_IO0")
  expect(netlist).toContain("  - U1 pin1 (OCTOSPI_IO0)")
  expect(netlist).toContain("- pin1(OCTOSPI_IO0): NETS(U1_OCTOSPI_IO0)")
})
