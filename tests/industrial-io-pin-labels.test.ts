import { expect, it } from "bun:test"
import type { AnyCircuitElement } from "circuit-json"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"

it("preserves PLC and discrete industrial IO aliases on generic pins", () => {
  const circuitJson: AnyCircuitElement[] = [
    {
      type: "source_component",
      source_component_id: "source_component_u1",
      name: "U1",
      ftype: "simple_chip",
      manufacturer_part_number: "PLC-IO",
    },
    {
      type: "source_component",
      source_component_id: "source_component_r1",
      name: "R1",
      ftype: "simple_resistor",
      resistance: 1000,
      display_resistance: "1kΩ",
    },
    {
      type: "source_component",
      source_component_id: "source_component_r2",
      name: "R2",
      ftype: "simple_resistor",
      resistance: 1000,
      display_resistance: "1kΩ",
    },
    {
      type: "source_port",
      source_port_id: "source_port_u1_pin14",
      source_component_id: "source_component_u1",
      name: "pin14",
      pin_number: 14,
      port_hints: ["PLC_DI1"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_u1_pin15",
      source_component_id: "source_component_u1",
      name: "pin15",
      pin_number: 15,
      port_hints: ["OPTO_IN1"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_r1_pin1",
      source_component_id: "source_component_r1",
      name: "pin1",
      pin_number: 1,
      port_hints: ["pos", "anode"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_r2_pin1",
      source_component_id: "source_component_r2",
      name: "pin1",
      pin_number: 1,
      port_hints: ["pos", "anode"],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_plc_di1",
      connected_source_port_ids: [
        "source_port_u1_pin14",
        "source_port_r1_pin1",
      ],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_opto_in1",
      connected_source_port_ids: [
        "source_port_u1_pin15",
        "source_port_r2_pin1",
      ],
    },
  ] as any

  const readableNetlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(readableNetlist).toContain("NET: U1_PLC_DI1")
  expect(readableNetlist).toContain("  - U1 pin14 (PLC_DI1)")
  expect(readableNetlist).toContain("- pin14(PLC_DI1): NETS(U1_PLC_DI1)")
  expect(readableNetlist).toContain("NET: U1_OPTO_IN1")
  expect(readableNetlist).toContain("  - U1 pin15 (OPTO_IN1)")
  expect(readableNetlist).toContain("- pin15(OPTO_IN1): NETS(U1_OPTO_IN1)")
})
