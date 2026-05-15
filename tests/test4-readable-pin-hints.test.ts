import { expect, it } from "bun:test"
import type { AnyCircuitElement } from "circuit-json"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { getReadableNameForPin } from "lib/getReadableNameForPin"

it("includes useful chip pin hints that contain digits", () => {
  const circuitJson: AnyCircuitElement[] = [
    {
      type: "source_component",
      source_component_id: "source_component_0",
      ftype: "simple_chip",
      name: "U1",
      manufacturer_part_number: "PICO_W",
    },
    {
      type: "source_port",
      source_port_id: "source_port_13",
      name: "pin14",
      pin_number: 14,
      port_hints: ["GP10_SPI1SCK_I2C1SDA", "pin14", "14"],
      source_component_id: "source_component_0",
    },
  ]

  expect(
    getReadableNameForPin({
      circuitJson,
      source_port_id: "source_port_13",
    }),
  ).toBe("U1 pin14 (GP10_SPI1SCK_I2C1SDA)")
})

it("renders useful digit-containing chip pin hints in readable netlists", () => {
  const circuitJson: AnyCircuitElement[] = [
    {
      type: "source_component",
      source_component_id: "source_component_0",
      ftype: "simple_chip",
      name: "U1",
      manufacturer_part_number: "PICO_W",
    },
    {
      type: "source_component",
      source_component_id: "source_component_1",
      ftype: "simple_resistor",
      name: "R1",
      resistance: 1000,
      display_resistance: "1k",
    },
    {
      type: "source_port",
      source_port_id: "source_port_13",
      name: "pin14",
      pin_number: 14,
      port_hints: ["GP10_SPI1SCK_I2C1SDA", "pin14", "14"],
      source_component_id: "source_component_0",
    },
    {
      type: "source_port",
      source_port_id: "source_port_r1_1",
      name: "pin1",
      pin_number: 1,
      port_hints: ["anode", "pos", "left"],
      source_component_id: "source_component_1",
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_0",
      connected_source_port_ids: ["source_port_13", "source_port_r1_1"],
      connected_source_net_ids: [],
    },
  ]

  expect(convertCircuitJsonToReadableNetlist(circuitJson)).toContain(
    "U1 pin14 (GP10_SPI1SCK_I2C1SDA)",
  )
})
