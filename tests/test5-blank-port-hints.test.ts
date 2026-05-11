import { expect, it } from "bun:test"
import type { AnyCircuitElement } from "circuit-json"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"

it("ignores blank port hints when naming nets and aliases", () => {
  const circuitJson: AnyCircuitElement[] = [
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
      name: "U2",
      manufacturer_part_number: "SENSOR",
    },
    {
      type: "source_port",
      source_port_id: "source_port_1",
      source_component_id: "source_component_1",
      name: "pin1",
      pin_number: 1,
      port_hints: ["   ", "pos"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_2",
      source_component_id: "source_component_2",
      name: "pin1",
      pin_number: 1,
      port_hints: ["\t", "positive"],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_1",
      connected_source_port_ids: ["source_port_1", "source_port_2"],
      connected_source_net_ids: [],
    },
  ] as AnyCircuitElement[]

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_pos")
  expect(netlist).toContain("- pin1(pos): NETS(U1_pos)")
  expect(netlist).toContain("- pin1(positive): NETS(U1_pos)")
  expect(netlist).not.toContain("NET: U1_   ")
  expect(netlist).not.toContain("pin1(   ")
  expect(netlist).not.toContain("pin1(\t")
})
