import { expect, it } from "bun:test"
import type { AnyCircuitElement } from "circuit-json"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"

declare module "bun:test" {
  interface Matchers<T = unknown> {
    toMatchInlineSnapshot(snapshot?: string | null): Promise<MatcherResult>
  }
}

it("uses meaningful chip pin hints and omits undefined passive footprint details", () => {
  const circuitJson: AnyCircuitElement[] = [
    {
      type: "source_component",
      source_component_id: "source_component_u1",
      ftype: "simple_chip",
      name: "U1",
      manufacturer_part_number: "RP2040",
    },
    {
      type: "source_port",
      source_port_id: "source_port_u1_pin14",
      name: "pin14",
      pin_number: 14,
      port_hints: ["GP10_SPI1SCK_I2C1SDA", "pin14", "14"],
      source_component_id: "source_component_u1",
    },
    {
      type: "source_component",
      source_component_id: "source_component_r1",
      ftype: "simple_resistor",
      name: "R1",
      resistance: 1000,
      display_resistance: "1kΩ",
    },
    {
      type: "source_port",
      source_port_id: "source_port_r1_pin1",
      name: "pin1",
      pin_number: 1,
      port_hints: ["anode", "pos", "left", "pin1", "1"],
      source_component_id: "source_component_r1",
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_1",
      connected_source_port_ids: [
        "source_port_u1_pin14",
        "source_port_r1_pin1",
      ],
      connected_source_net_ids: [],
    },
  ]

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).not.toContain("undefined")
  expect(netlist).toContain("U1 pin14 (GP10_SPI1SCK_I2C1SDA)")
  expect(netlist).toMatchInlineSnapshot(`
    "COMPONENTS:
     - U1: RP2040
     - R1: 1kΩ resistor

    NET: U1_GP10_SPI1SCK_I2C1SDA
      - U1 pin14 (GP10_SPI1SCK_I2C1SDA)
      - R1 pin1


    COMPONENT_PINS:
    U1 (RP2040)
    - pin14(GP10_SPI1SCK_I2C1SDA): NETS(U1_GP10_SPI1SCK_I2C1SDA)

    R1 (1kΩ)
    - pin1(anode, pos, left): NETS(U1_GP10_SPI1SCK_I2C1SDA)
    "
  `)
})
