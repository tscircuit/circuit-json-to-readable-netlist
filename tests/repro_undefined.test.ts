import { test, expect } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "../lib/convertCircuitJsonToReadableNetlist"
import type { AnyCircuitElement } from "circuit-json"

test("Output should not contain undefined when cad_component is missing", () => {
  const circuitJson: AnyCircuitElement[] = [
    {
      type: "source_component",
      source_component_id: "res1",
      name: "R1",
      ftype: "simple_resistor",
      display_resistance: "1k",
    },
    {
      type: "source_port",
      source_port_id: "res1_p1",
      source_component_id: "res1",
      name: "1",
      pin_number: 1,
    }
  ]

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)
  
  console.log("Netlist output:\n", netlist)
  
  expect(netlist).not.toContain("undefined")
})

test("Output should not contain Pinundefined when pin_number and name are missing", () => {
  const circuitJson: AnyCircuitElement[] = [
    {
      type: "source_component",
      source_component_id: "u1",
      name: "U1",
    },
    {
      type: "source_port",
      source_port_id: "u1_p1",
      source_component_id: "u1",
    }
  ]

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)
  
  expect(netlist).not.toContain("undefined")
})
