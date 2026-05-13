import { expect, it } from "bun:test"
import type { AnyCircuitElement } from "circuit-json"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"

it("keeps load cell and bridge sensor pin aliases readable", () => {
  const circuitJson: AnyCircuitElement[] = [
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_load_cell",
      name: "U1",
      manufacturer_part_number: "HX711",
    },
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_mcu",
      name: "U2",
      manufacturer_part_number: "RP2040",
    },
    {
      type: "source_port",
      source_port_id: "source_port_bridge_excitation",
      source_component_id: "source_component_load_cell",
      name: "pin2",
      pin_number: 2,
      port_hints: ["2", "pin2", "BRIDGE_EXCITATION", "EXCITATION_ENABLE"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_mcu_excitation",
      source_component_id: "source_component_mcu",
      name: "pin11",
      pin_number: 11,
      port_hints: ["11", "pin11", "GPIO_EXCITE"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_load_cell_signal",
      source_component_id: "source_component_load_cell",
      name: "pin3",
      pin_number: 3,
      port_hints: ["3", "pin3", "LOAD_CELL_SIGNAL", "SENSE_REFERENCE"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_mcu_load_cell_signal",
      source_component_id: "source_component_mcu",
      name: "pin12",
      pin_number: 12,
      port_hints: ["12", "pin12", "GPIO_LOAD"],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_bridge_excitation",
      connected_source_port_ids: [
        "source_port_bridge_excitation",
        "source_port_mcu_excitation",
      ],
      connected_source_net_ids: [],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_load_cell_signal",
      connected_source_port_ids: [
        "source_port_load_cell_signal",
        "source_port_mcu_load_cell_signal",
      ],
      connected_source_net_ids: [],
    },
  ]

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_BRIDGE_EXCITATION")
  expect(netlist).toContain("  - U1 pin2 (BRIDGE_EXCITATION,EXCITATION_ENABLE)")
  expect(netlist).toContain("NET: U1_LOAD_CELL_SIGNAL")
  expect(netlist).toContain("  - U1 pin3 (LOAD_CELL_SIGNAL,SENSE_REFERENCE)")
  expect(netlist).not.toContain("undefined")
})
