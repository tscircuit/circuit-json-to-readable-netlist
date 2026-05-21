import { expect, it } from "bun:test"
import type { AnyCircuitElement } from "circuit-json"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"

declare module "bun:test" {
  interface Matchers<T = unknown> {
    toMatchInlineSnapshot(snapshot?: string | null): Promise<MatcherResult>
  }
}

it("shows descriptive chip pin hints when the port name is only pin number", () => {
  const circuitJson: AnyCircuitElement[] = [
    {
      type: "source_component",
      source_component_id: "source_component_0",
      name: "U1",
      ftype: "simple_chip",
      manufacturer_part_number: "PICO_W",
    },
    {
      type: "source_component",
      source_component_id: "source_component_1",
      name: "LED1",
      ftype: "simple_chip",
      manufacturer_part_number: "WS2812B_2020",
    },
    {
      type: "source_port",
      source_port_id: "source_port_0",
      name: "pin14",
      pin_number: 14,
      port_hints: ["GP10_SPI1SCK_I2C1SDA", "pin14", "14"],
      source_component_id: "source_component_0",
    },
    {
      type: "source_port",
      source_port_id: "source_port_1",
      name: "pin3",
      pin_number: 3,
      port_hints: ["DI", "pin3", "3"],
      source_component_id: "source_component_1",
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_0",
      connected_source_port_ids: ["source_port_0", "source_port_1"],
      connected_source_net_ids: [],
      display_name: ".U1 .GP10_SPI1SCK_I2C1SDA to .LED1 .DI",
    },
  ]

  expect(
    convertCircuitJsonToReadableNetlist(circuitJson),
  ).toMatchInlineSnapshot(`
    "COMPONENTS:
     - U1: PICO_W
     - LED1: WS2812B_2020

    NET: LED1_DI
      - U1 pin14 (GP10_SPI1SCK_I2C1SDA)
      - LED1 pin3 (DI)


    COMPONENT_PINS:
    U1 (PICO_W)
    - pin14(GP10_SPI1SCK_I2C1SDA): NETS(LED1_DI)

    LED1 (WS2812B_2020)
    - pin3(DI): NETS(LED1_DI)
    "
  `)
})
