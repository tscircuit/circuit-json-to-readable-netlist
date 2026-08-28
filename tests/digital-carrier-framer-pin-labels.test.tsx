import { expect, it } from "bun:test"
import type { AnyCircuitElement } from "circuit-json"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { scorePhrase } from "lib/scorePhrase"

it("scores digital carrier framer aliases above generic numbered pins", () => {
  expect(scorePhrase("DS1_RCLK")).toBeGreaterThan(scorePhrase("pos"))
  expect(scorePhrase("E1_LOS1")).toBeGreaterThan(scorePhrase("pin15"))
  expect(scorePhrase("T1_AIS")).toBeGreaterThan(1)
  expect(scorePhrase("HDLC_FLAG")).toBeGreaterThan(1)
})

it("preserves digital carrier framer aliases in readable netlists", () => {
  const circuitJson: AnyCircuitElement[] = [
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_framer",
      name: "FR1",
      manufacturer_part_number: "DS2155",
    },
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_monitor",
      name: "MON1",
      manufacturer_part_number: "TEST_MONITOR",
    },
    {
      type: "source_port",
      source_port_id: "source_port_framer_rclk",
      source_component_id: "source_component_framer",
      pin_number: 14,
      name: "pin14",
      port_hints: ["DS1_RCLK"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_monitor_pos",
      source_component_id: "source_component_monitor",
      pin_number: 1,
      name: "pin1",
      port_hints: ["pos"],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_rclk",
      connected_source_port_ids: [
        "source_port_framer_rclk",
        "source_port_monitor_pos",
      ],
      connected_source_net_ids: [],
    },
  ]

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: FR1_DS1_RCLK")
  expect(netlist).toContain("  - FR1 pin14 (DS1_RCLK)")
  expect(netlist).toContain("- pin14(DS1_RCLK): NETS(FR1_DS1_RCLK)")
})
