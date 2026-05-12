import { expect, it } from "bun:test"
import type { AnyCircuitElement } from "circuit-json"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { scorePhrase } from "lib/scorePhrase"

it("scores I3C aliases before the generic digit fallback", () => {
  expect(scorePhrase("I3C_SDA")).toBe(1.2)
  expect(scorePhrase("I3C_SCL")).toBe(1.2)
  expect(scorePhrase("IBI")).toBe(1.2)
  expect(scorePhrase("ENTDAA")).toBe(1.2)
  expect(scorePhrase("HDR_DDR")).toBe(1.15)
  expect(scorePhrase("GPIO1")).toBe(1.1)
})

it("keeps I3C aliases in readable net output", () => {
  const circuitJson = [
    {
      type: "source_component",
      source_component_id: "source_component_i3c_controller",
      name: "U1",
      ftype: "simple_chip",
      manufacturer_part_number: "I3C_CONTROLLER",
    },
    {
      type: "source_component",
      source_component_id: "source_component_sensor",
      name: "U2",
      ftype: "simple_chip",
      manufacturer_part_number: "GENERIC_SENSOR",
    },
    {
      type: "source_port",
      source_port_id: "source_port_i3c_sda",
      source_component_id: "source_component_i3c_controller",
      name: "pin14",
      pin_number: 14,
      port_hints: ["pin14", "I3C_SDA"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_sensor_pin",
      source_component_id: "source_component_sensor",
      name: "pin2",
      pin_number: 2,
      port_hints: ["pin2"],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_i3c_sda",
      connected_source_port_ids: [
        "source_port_i3c_sda",
        "source_port_sensor_pin",
      ],
      connected_source_net_ids: [],
    },
  ] as AnyCircuitElement[]

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_I3C_SDA")
  expect(netlist).toContain("  - U1 pin14 (I3C_SDA)")
  expect(netlist).not.toContain("NET: U1_pin14")
})
