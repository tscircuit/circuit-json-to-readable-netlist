import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"

it("should not output 'undefined' when pin_number and port.name are missing", () => {
  const circuitJson = [
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
      port_hints: ["DATA_IN", "INPUT"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_2",
      source_component_id: "source_component_1",
      port_hints: [],
    },
    {
      type: "source_net",
      source_net_id: "source_net_1",
      name: "test_net",
      member_source_group_ids: [],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_1",
      connected_source_port_ids: ["source_port_1"],
      connected_source_net_ids: ["source_net_1"],
    },
  ] as any

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).not.toContain("undefined")
  expect(netlist).not.toContain("Pinundefined")
  // Fallback name should use port ID suffix
  expect(netlist).toMatch(/Port|port/)
})

it("should display rich port hints when available", () => {
  const circuitJson = [
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
      member_source_group_ids: [],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_1",
      connected_source_port_ids: ["source_port_1"],
      connected_source_net_ids: ["source_net_1"],
    },
  ] as any

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).not.toContain("undefined")
  expect(netlist).toContain("USART1_TX")
  expect(netlist).toContain("TX")
  expect(netlist).toContain("GPIO_A9")
})

it("should handle resistor with undefined display_resistance", () => {
  const circuitJson = [
    {
      type: "source_component",
      source_component_id: "source_component_1",
      name: "R1",
      ftype: "simple_resistor",
      resistance: 1000,
    },
    {
      type: "source_port",
      source_port_id: "source_port_1",
      source_component_id: "source_component_1",
      name: "pin1",
      pin_number: 1,
    },
  ] as any

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).not.toContain("undefined")
  expect(netlist).toContain("unknown")
})

it("should handle capacitor with undefined display_capacitance", () => {
  const circuitJson = [
    {
      type: "source_component",
      source_component_id: "source_component_1",
      name: "C1",
      ftype: "simple_capacitor",
      capacitance: 0.000001,
    },
    {
      type: "source_port",
      source_port_id: "source_port_1",
      source_component_id: "source_component_1",
      name: "pin1",
      pin_number: 1,
    },
  ] as any

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).not.toContain("undefined")
  expect(netlist).toContain("unknown")
})

it("should handle empty phrases array in generateNetName", () => {
  const circuitJson = [
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
      pin_number: 1,
      port_hints: [],
    },
    {
      type: "source_port",
      source_port_id: "source_port_2",
      source_component_id: "source_component_1",
      pin_number: 2,
      port_hints: [],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_1",
      connected_source_port_ids: ["source_port_1", "source_port_2"],
      connected_source_net_ids: [],
    },
  ] as any

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).not.toContain("undefined")
  expect(netlist).toMatch(/NET:\s+\w+/)
})

it("comprehensive undefined test - all edge cases", () => {
  const circuitJson = [
    {
      type: "source_component",
      source_component_id: "source_component_1",
      name: "U1",
      ftype: "simple_chip",
    },
    {
      type: "source_component",
      source_component_id: "source_component_2",
      name: "R1",
      ftype: "simple_resistor",
      resistance: 1000,
    },
    {
      type: "source_component",
      source_component_id: "source_component_3",
      name: "C1",
      ftype: "simple_capacitor",
      capacitance: 0.000001,
    },
    {
      type: "source_port",
      source_port_id: "source_port_1",
      source_component_id: "source_component_1",
      port_hints: [],
    },
  ] as any

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).not.toContain("undefined")
  expect(netlist).not.toContain("Pinundefined")
})
