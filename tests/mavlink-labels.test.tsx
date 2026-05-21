import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { scorePhrase } from "lib/scorePhrase"

it("prefers MAVLink autopilot telemetry labels that include numbers", () => {
  expect(scorePhrase("MAVLINK_TX1")).toBeGreaterThan(scorePhrase("pos"))
  expect(scorePhrase("PX4_IO1")).toBeGreaterThan(scorePhrase("pos"))
  expect(scorePhrase("ARDUPILOT_SAFETY1")).toBeGreaterThan(scorePhrase("pos"))
  expect(scorePhrase("topic1")).toBe(0.5)
})

it("uses MAVLink labels for readable net names and component pins", () => {
  const circuitJson: any[] = [
    {
      type: "source_component",
      source_component_id: "source_component_0",
      ftype: "simple_chip",
      name: "U1",
      manufacturer_part_number: "PIXHAWK-FMU",
    },
    {
      type: "source_component",
      source_component_id: "source_component_1",
      ftype: "simple_resistor",
      name: "R1",
      display_resistance: "1k",
    },
    {
      type: "source_port",
      source_port_id: "source_port_0",
      source_component_id: "source_component_0",
      name: "pin1",
      pin_number: 1,
      port_hints: ["MAVLINK_TX1"],
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
    },
  ]

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_MAVLINK_TX1")
  expect(netlist).toContain("  - U1 pin1 (MAVLINK_TX1)")
  expect(netlist).toContain("- pin1(MAVLINK_TX1): NETS(U1_MAVLINK_TX1)")
})
