import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"

it("includes meaningful labels for numbered chip pins", () => {
  const circuitJson: any[] = [
    {
      type: "source_port",
      source_port_id: "source_port_0",
      name: "pin14",
      pin_number: 14,
      port_hints: ["GP10_SPI1SCK_I2C1SDA", "pin14", "14"],
      source_component_id: "source_component_0",
    },
    {
      type: "source_component",
      source_component_id: "source_component_0",
      ftype: "simple_chip",
      name: "U1",
      manufacturer_part_number: "PICO_W",
    },
    {
      type: "source_port",
      source_port_id: "source_port_1",
      name: "pin1",
      pin_number: 1,
      port_hints: ["anode", "pos", "left", "pin1", "1"],
      source_component_id: "source_component_1",
    },
    {
      type: "source_component",
      source_component_id: "source_component_1",
      ftype: "simple_resistor",
      name: "R1",
      resistance: 1000,
      display_resistance: "1k",
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_0",
      connected_source_port_ids: ["source_port_0", "source_port_1"],
      connected_source_net_ids: [],
    },
  ]

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("  - U1 pin14 (GP10_SPI1SCK_I2C1SDA)")
  expect(netlist).toContain("- pin14(GP10_SPI1SCK_I2C1SDA): NETS(R1_pos)")
  expect(netlist).toContain("R1 (1k)")
  expect(netlist).not.toContain("undefined")
})
