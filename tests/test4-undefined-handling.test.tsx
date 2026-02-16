import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import type { AnyCircuitElement } from "circuit-json"

declare module "bun:test" {
  interface Matchers<T = unknown> {
    toMatchInlineSnapshot(snapshot?: string | null): Promise<MatcherResult>
  }
}

it("should not output 'undefined' when pin_number and port.name are missing", () => {
  // Create a minimal circuit JSON with a component that has a port
  // with undefined pin_number and undefined name
  const circuitJson: AnyCircuitElement[] = [
    {
      type: "source_component",
      source_component_id: "source_component_1",
      name: "U1",
      ftype: "simple_chip",
      manufacturer_part_number: undefined as any,
    },
    {
      type: "source_port",
      source_port_id: "source_port_1",
      source_component_id: "source_component_1",
      name: undefined as any,
      pin_number: undefined as any,
      port_hints: ["DATA_IN", "INPUT"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_2",
      source_component_id: "source_component_1",
      name: undefined as any,
      pin_number: undefined as any,
      port_hints: [],
    },
    {
      type: "source_net",
      source_net_id: "source_net_1",
      name: "test_net",
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_1",
      connected_source_port_ids: ["source_port_1"],
      connected_source_net_ids: ["source_net_1"],
    },
  ]

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  // Verify no "undefined" appears anywhere in the output
  expect(netlist).not.toContain("undefined")
  expect(netlist).not.toContain("Pinundefined")

  // Verify the output contains proper fallback names
  expect(netlist).toContain("Port")
})

it("should display rich port hints when available", () => {
  const circuitJson: AnyCircuitElement[] = [
    {
      type: "source_component",
      source_component_id: "source_component_1",
      name: "MCU1",
      ftype: "simple_chip",
      manufacturer_part_number: "STM32F103",
    },
    {
      type: "source_port",
      source_port_id: "source_port_1",
      source_component_id: "source_component_1",
      name: "PA9",
      pin_number: 42,
      port_hints: ["USART1_TX", "TX", "GPIO_A9"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_2",
      source_component_id: "source_component_1",
      name: "PA10",
      pin_number: 43,
      port_hints: ["USART1_RX", "RX", "GPIO_A10"],
    },
    {
      type: "source_net",
      source_net_id: "source_net_1",
      name: "UART_TX",
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_1",
      connected_source_port_ids: ["source_port_1"],
      connected_source_net_ids: ["source_net_1"],
    },
  ]

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  // Verify no undefined
  expect(netlist).not.toContain("undefined")

  // Verify rich port hints are displayed
  expect(netlist).toContain("USART1_TX")
  expect(netlist).toContain("TX")
  expect(netlist).toContain("GPIO_A9")
  expect(netlist).toContain("USART1_RX")
  expect(netlist).toContain("RX")
  expect(netlist).toContain("GPIO_A10")
})

it("should handle resistor with undefined display_resistance", () => {
  const circuitJson: AnyCircuitElement[] = [
    {
      type: "source_component",
      source_component_id: "source_component_1",
      name: "R1",
      ftype: "simple_resistor",
      display_resistance: undefined as any,
    },
    {
      type: "source_port",
      source_port_id: "source_port_1",
      source_component_id: "source_component_1",
      name: "pin1",
      pin_number: 1,
    },
  ]

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  // Should not output "undefined"
  expect(netlist).not.toContain("undefined")
  // Should use "unknown" as fallback
  expect(netlist).toContain("unknown")
})

it("should handle capacitor with undefined display_capacitance", () => {
  const circuitJson: AnyCircuitElement[] = [
    {
      type: "source_component",
      source_component_id: "source_component_1",
      name: "C1",
      ftype: "simple_capacitor",
      display_capacitance: undefined as any,
    },
    {
      type: "source_port",
      source_port_id: "source_port_1",
      source_component_id: "source_component_1",
      name: "pin1",
      pin_number: 1,
    },
  ]

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  // Should not output "undefined"
  expect(netlist).not.toContain("undefined")
  // Should use "unknown" as fallback
  expect(netlist).toContain("unknown")
})

it("should handle empty phrases array in generateNetName", () => {
  // Create a scenario where no port names or hints exist
  const circuitJson: AnyCircuitElement[] = [
    {
      type: "source_component",
      source_component_id: "source_component_1",
      name: "U1",
      ftype: "simple_chip",
    },
    {
      type: "source_port",
      source_port_id: "source_port_1",
      source_component_id: "source_component_1",
      name: undefined as any,
      pin_number: 1,
      port_hints: [],
    },
    {
      type: "source_port",
      source_port_id: "source_port_2",
      source_component_id: "source_component_1",
      name: undefined as any,
      pin_number: 2,
      port_hints: [],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_1",
      connected_source_port_ids: ["source_port_1", "source_port_2"],
    },
  ]

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  // Should not output "undefined"
  expect(netlist).not.toContain("undefined")
  // Should generate a fallback net name
  expect(netlist).toMatch(/NET:\s+\w+/)
})

it("comprehensive undefined test - all edge cases", () => {
  const circuitJson: AnyCircuitElement[] = [
    // Chip with no manufacturer part number
    {
      type: "source_component",
      source_component_id: "source_component_1",
      name: "U1",
      ftype: "simple_chip",
      manufacturer_part_number: undefined as any,
    },
    // Resistor with no display value
    {
      type: "source_component",
      source_component_id: "source_component_2",
      name: "R1",
      ftype: "simple_resistor",
      display_resistance: undefined as any,
    },
    // Capacitor with no display value
    {
      type: "source_component",
      source_component_id: "source_component_3",
      name: "C1",
      ftype: "simple_capacitor",
      display_capacitance: undefined as any,
    },
    // Port with no name, no pin_number, no hints
    {
      type: "source_port",
      source_port_id: "source_port_1",
      source_component_id: "source_component_1",
      name: undefined as any,
      pin_number: undefined as any,
      port_hints: [],
    },
  ]

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  // The golden rule: NO "undefined" anywhere
  expect(netlist).not.toContain("undefined")
  expect(netlist).not.toContain("Pinundefined")
})
