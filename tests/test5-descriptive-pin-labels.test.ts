import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import type { AnyCircuitElement } from "circuit-json"

declare module "bun:test" {
  interface Matchers<T = unknown> {
    toMatchInlineSnapshot(snapshot?: string | null): Promise<MatcherResult>
  }
}

it("netlist uses descriptive pin labels from port_hints instead of pin numbers", () => {
  const circuitJson: AnyCircuitElement[] = [
    {
      type: "source_component",
      source_component_id: "source_component_1",
      name: "U1",
      ftype: "simple_chip",
      manufacturer_part_number: "ESP32",
    } as AnyCircuitElement,
    {
      type: "source_port",
      source_port_id: "source_port_1",
      source_component_id: "source_component_1",
      name: undefined,
      pin_number: 1,
      port_hints: ["1", "GND"],
    } as AnyCircuitElement,
    {
      type: "source_port",
      source_port_id: "source_port_2",
      source_component_id: "source_component_1",
      name: undefined,
      pin_number: 2,
      port_hints: ["2", "GPIO0"],
    } as AnyCircuitElement,
    {
      type: "source_port",
      source_port_id: "source_port_3",
      source_component_id: "source_component_1",
      name: undefined,
      pin_number: 3,
      port_hints: ["3", "GPIO1", "SCL"],
    } as AnyCircuitElement,
    {
      type: "source_port",
      source_port_id: "source_port_4",
      source_component_id: "source_component_1",
      name: undefined,
      pin_number: 4,
      port_hints: ["4", "VDD"],
    } as AnyCircuitElement,
    {
      type: "source_port",
      source_port_id: "source_port_5",
      source_component_id: "source_component_1",
      name: undefined,
      pin_number: 5,
      port_hints: ["5", "GPIO2", "SDA"],
    } as AnyCircuitElement,
    {
      type: "source_port",
      source_port_id: "source_port_6",
      source_component_id: "source_component_1",
      name: undefined,
      pin_number: 6,
      port_hints: ["6", "TX"],
    } as AnyCircuitElement,
    {
      type: "source_port",
      source_port_id: "source_port_7",
      source_component_id: "source_component_1",
      name: undefined,
      pin_number: 7,
      port_hints: ["7", "RX"],
    } as AnyCircuitElement,
    {
      type: "source_port",
      source_port_id: "source_port_8",
      source_component_id: "source_component_1",
      name: undefined,
      pin_number: 8,
      port_hints: ["8", "MISO"],
    } as AnyCircuitElement,
    {
      type: "source_trace",
      source_trace_id: "source_trace_1",
      connected_source_port_ids: ["source_port_1", "source_port_4"],
      connected_source_net_id: "source_net_1",
    } as AnyCircuitElement,
    {
      type: "source_net",
      source_net_id: "source_net_1",
      name: "VDD_GND",
    } as AnyCircuitElement,
  ]

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).not.toContain("undefined")
  expect(netlist).toContain("GND")
  expect(netlist).toContain("GPIO0")
  expect(netlist).toContain("SCL")
  expect(netlist).toContain("VDD")
  expect(netlist).toContain("SDA")
  expect(netlist).toContain("TX")
  expect(netlist).toContain("RX")
  expect(netlist).toContain("MISO")
})

it("netlist does not contain 'undefined' for chip without pinLabels", () => {
  const circuitJson: AnyCircuitElement[] = [
    {
      type: "source_component",
      source_component_id: "source_component_1",
      name: "LED1",
      ftype: "simple_chip",
      manufacturer_part_number: "WS2812B",
    } as AnyCircuitElement,
    {
      type: "source_port",
      source_port_id: "source_port_1",
      source_component_id: "source_component_1",
      name: undefined,
      pin_number: 1,
      port_hints: ["1"],
    } as AnyCircuitElement,
    {
      type: "source_port",
      source_port_id: "source_port_2",
      source_component_id: "source_component_1",
      name: undefined,
      pin_number: 2,
      port_hints: ["2"],
    } as AnyCircuitElement,
  ]

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)
  expect(netlist).not.toContain("undefined")
})
