import { expect, it } from "bun:test"
import type { AnyCircuitElement } from "circuit-json"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"

it("keeps flame detector aliases in readable net names and pins", () => {
  const circuitJson: AnyCircuitElement[] = [
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_fd1",
      name: "FD1",
      manufacturer_part_number: "YG1006",
    },
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_u1",
      name: "U1",
      manufacturer_part_number: "RP2040",
    },
    {
      type: "source_port",
      source_port_id: "source_port_fd1_1",
      source_component_id: "source_component_fd1",
      name: "pin1",
      pin_number: 1,
      port_hints: ["FLAME_OUT1", "DO"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_fd1_2",
      source_component_id: "source_component_fd1",
      name: "pin2",
      pin_number: 2,
      port_hints: ["UV_FLAME1"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_u1_14",
      source_component_id: "source_component_u1",
      name: "pin14",
      pin_number: 14,
      port_hints: ["FIRE_ALARM1", "GPIO14"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_u1_15",
      source_component_id: "source_component_u1",
      name: "pin15",
      pin_number: 15,
      port_hints: ["IR_FLAME1", "ADC15"],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_flame_alarm",
      connected_source_port_ids: ["source_port_fd1_1", "source_port_u1_14"],
      connected_source_net_ids: [],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_flame_adc",
      connected_source_port_ids: ["source_port_fd1_2", "source_port_u1_15"],
      connected_source_net_ids: [],
    },
  ]

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: FD1_FLAME_OUT1")
  expect(netlist).toContain("  - FD1 pin1 (FLAME_OUT1)")
  expect(netlist).toContain("  - U1 pin14 (FIRE_ALARM1)")
  expect(netlist).toContain("NET: FD1_UV_FLAME1")
  expect(netlist).toContain("  - FD1 pin2 (UV_FLAME1)")
  expect(netlist).toContain("  - U1 pin15 (IR_FLAME1)")
})
