import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"

it("preserves JESD204 converter aliases for generic numbered chip pins", () => {
  const circuitJson = [
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_fpga",
      name: "U1",
      manufacturer_part_number: "XC7A35T",
    },
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_adc",
      name: "U2",
      manufacturer_part_number: "AD9695",
    },
    {
      type: "source_port",
      source_port_id: "source_port_fpga_jesd_tx",
      source_component_id: "source_component_fpga",
      name: "pin14",
      pin_number: 14,
      port_hints: ["JESD204B_TX0_P"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_adc_jesd_rx",
      source_component_id: "source_component_adc",
      name: "pin3",
      pin_number: 3,
      port_hints: ["JESD204B_RX0_P"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_fpga_sysref",
      source_component_id: "source_component_fpga",
      name: "pin15",
      pin_number: 15,
      port_hints: ["SYSREF_P"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_adc_sysref",
      source_component_id: "source_component_adc",
      name: "pin4",
      pin_number: 4,
      port_hints: ["SYSREFP"],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_jesd_tx",
      connected_source_port_ids: [
        "source_port_fpga_jesd_tx",
        "source_port_adc_jesd_rx",
      ],
      connected_source_net_ids: [],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_sysref",
      connected_source_port_ids: [
        "source_port_fpga_sysref",
        "source_port_adc_sysref",
      ],
      connected_source_net_ids: [],
    },
  ] as any[]

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_JESD204B_TX0_P")
  expect(netlist).toContain("  - U1 pin14 (JESD204B_TX0_P)")
  expect(netlist).toContain("  - U2 pin3 (JESD204B_RX0_P)")
  expect(netlist).toContain("NET: U1_SYSREF_P")
  expect(netlist).toContain("  - U1 pin15 (SYSREF_P)")
  expect(netlist).toContain("  - U2 pin4 (SYSREFP)")
  expect(netlist).not.toContain("NET: U1_pin14")
})

it("preserves JESD204 negative lanes and converter timing/control aliases", () => {
  const circuitJson = [
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_fpga",
      name: "U1",
      manufacturer_part_number: "XC7A35T",
    },
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_dac",
      name: "U2",
      manufacturer_part_number: "AD9144",
    },
    {
      type: "source_port",
      source_port_id: "source_port_fpga_jesd_rx_n",
      source_component_id: "source_component_fpga",
      name: "pin16",
      pin_number: 16,
      port_hints: ["JESD204C_RX12_N"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_dac_jesd_tx_n",
      source_component_id: "source_component_dac",
      name: "pin8",
      pin_number: 8,
      port_hints: ["JESD204C_TX12_N"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_fpga_sync",
      source_component_id: "source_component_fpga",
      name: "pin17",
      pin_number: 17,
      port_hints: ["SYNCB"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_dac_sync",
      source_component_id: "source_component_dac",
      name: "pin9",
      pin_number: 9,
      port_hints: ["SYNC_N"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_fpga_lmfc",
      source_component_id: "source_component_fpga",
      name: "pin18",
      pin_number: 18,
      port_hints: ["LMFC"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_dac_lmfc",
      source_component_id: "source_component_dac",
      name: "pin10",
      pin_number: 10,
      port_hints: ["LMFC"],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_jesd_rx_n",
      connected_source_port_ids: [
        "source_port_fpga_jesd_rx_n",
        "source_port_dac_jesd_tx_n",
      ],
      connected_source_net_ids: [],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_sync",
      connected_source_port_ids: [
        "source_port_fpga_sync",
        "source_port_dac_sync",
      ],
      connected_source_net_ids: [],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_lmfc",
      connected_source_port_ids: [
        "source_port_fpga_lmfc",
        "source_port_dac_lmfc",
      ],
      connected_source_net_ids: [],
    },
  ] as any[]

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_JESD204C_RX12_N")
  expect(netlist).toContain("  - U1 pin16 (JESD204C_RX12_N)")
  expect(netlist).toContain("  - U2 pin8 (JESD204C_TX12_N)")
  expect(netlist).toContain("NET: U1_SYNCB")
  expect(netlist).toContain("  - U1 pin17 (SYNCB)")
  expect(netlist).toContain("  - U2 pin9 (SYNC_N)")
  expect(netlist).toContain("NET: U1_LMFC")
  expect(netlist).toContain("  - U1 pin18 (LMFC)")
  expect(netlist).toContain("  - U2 pin10 (LMFC)")
  expect(netlist).not.toContain("NET: U1_pin16")
})
