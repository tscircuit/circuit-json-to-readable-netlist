import { expect, it } from "bun:test"
import type { AnyCircuitElement } from "circuit-json"
import { generateNetName } from "lib/generateNetName"
import { getReadableNameForPin } from "lib/getReadableNameForPin"
import { scorePhrase } from "lib/scorePhrase"

const circuitJson = [
  {
    type: "source_component",
    ftype: "simple_chip",
    source_component_id: "source_component_1",
    name: "U1",
    manufacturer_part_number: "DS18B20",
  },
  {
    type: "source_component",
    ftype: "simple_resistor",
    source_component_id: "source_component_2",
    name: "R1",
    display_resistance: "4.7kΩ",
  },
  {
    type: "source_port",
    source_port_id: "source_port_1",
    source_component_id: "source_component_1",
    name: "pin14",
    pin_number: 14,
    port_hints: ["pin14", "ONEWIRE_DQ1"],
  },
  {
    type: "source_port",
    source_port_id: "source_port_2",
    source_component_id: "source_component_2",
    name: "pos",
    pin_number: 1,
    port_hints: ["pos", "anode", "left"],
  },
] as AnyCircuitElement[]

it("prefers 1-Wire data aliases over generic numbered pins", () => {
  expect(scorePhrase("ONEWIRE_DQ1")).toBeGreaterThan(scorePhrase("pin14"))
  expect(scorePhrase("1WIRE_DQ")).toBeGreaterThan(scorePhrase("pos"))

  expect(
    generateNetName({
      circuitJson,
      connectedIds: ["source_port_1", "source_port_2"],
    }),
  ).toBe("U1_ONEWIRE_DQ1")

  expect(
    getReadableNameForPin({
      circuitJson,
      source_port_id: "source_port_1",
    }),
  ).toBe("U1 pin14 (ONEWIRE_DQ1)")
})
