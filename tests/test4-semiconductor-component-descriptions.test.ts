import { expect, it } from "bun:test"
import type { AnyCircuitElement } from "circuit-json"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"

it("renders semiconductor component metadata in readable sections", () => {
  const circuitJson: AnyCircuitElement[] = [
    {
      type: "source_component",
      source_component_id: "source_component_q1",
      name: "Q1",
      ftype: "simple_transistor",
      transistor_type: "npn",
    },
    {
      type: "source_port",
      source_port_id: "source_port_q1_collector",
      source_component_id: "source_component_q1",
      name: "collector",
      pin_number: 1,
      port_hints: ["collector"],
    },
    {
      type: "source_component",
      source_component_id: "source_component_q2",
      name: "Q2",
      ftype: "simple_mosfet",
      channel_type: "n",
      mosfet_mode: "enhancement",
    },
    {
      type: "source_port",
      source_port_id: "source_port_q2_gate",
      source_component_id: "source_component_q2",
      name: "gate",
      pin_number: 1,
      port_hints: ["gate"],
    },
  ]

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("- Q1: NPN transistor")
  expect(netlist).toContain("- Q2: n-channel enhancement MOSFET")
  expect(netlist).toContain("Q1 (NPN transistor)")
  expect(netlist).toContain("Q2 (n-channel enhancement MOSFET)")
  expect(netlist).not.toContain("Q1, source_component")
  expect(netlist).not.toContain("Q2, source_component")
})
