import { expect, it } from "bun:test"
import type { AnyCircuitElement } from "circuit-json"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"

it("uses actual source_port ids when rendering readable nets", () => {
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
      name: "J1",
      manufacturer_part_number: "CONN",
    },
    {
      type: "source_port",
      source_port_id: "u1-alert",
      source_component_id: "source_component_1",
      name: "ALERT",
      pin_number: 1,
      port_hints: ["ALERT"],
    },
    {
      type: "source_port",
      source_port_id: "j1-alert",
      source_component_id: "source_component_2",
      name: "ALERT_IN",
      pin_number: 2,
      port_hints: ["ALERT_IN"],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_1",
      connected_source_port_ids: ["u1-alert", "j1-alert"],
      connected_source_net_ids: [],
    },
  ]

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_ALERT")
  expect(netlist).toContain("  - U1 ALERT")
  expect(netlist).toContain("  - J1 ALERT_IN")
  expect(netlist).toContain("- pin1(ALERT): NETS(U1_ALERT)")
  expect(netlist).toContain("- pin2(ALERT_IN): NETS(U1_ALERT)")
})
