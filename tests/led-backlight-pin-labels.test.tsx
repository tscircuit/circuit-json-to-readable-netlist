import { expect, it } from "bun:test"
import type { AnyCircuitElement } from "circuit-json"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"

const circuitJson: AnyCircuitElement[] = [
  {
    type: "source_component",
    source_component_id: "source_component_0",
    ftype: "simple_chip",
    name: "U1",
    manufacturer_part_number: "LED_DRIVER",
  } as any,
  {
    type: "source_component",
    source_component_id: "source_component_1",
    ftype: "simple_chip",
    name: "J1",
    manufacturer_part_number: "LED_HEADER",
  } as any,
  {
    type: "source_port",
    source_port_id: "source_port_0",
    source_component_id: "source_component_0",
    name: "pin14",
    pin_number: 14,
    port_hints: ["pin14", "LED_R", "BL_PWM", "LEDK"],
  },
  {
    type: "source_port",
    source_port_id: "source_port_1",
    source_component_id: "source_component_1",
    name: "pin1",
    pin_number: 1,
    port_hints: ["pin1"],
  },
  {
    type: "source_trace",
    source_trace_id: "source_trace_0",
    connected_source_port_ids: ["source_port_0", "source_port_1"],
  } as any,
]

it("preserves LED and backlight aliases on generic chip pins", () => {
  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_LED_R")
  expect(netlist).toContain("  - U1 pin14 (LED_R,BL_PWM,LEDK)")
  expect(netlist).toContain("- pin14(LED_R, BL_PWM, LEDK): NETS(U1_LED_R)")
})
