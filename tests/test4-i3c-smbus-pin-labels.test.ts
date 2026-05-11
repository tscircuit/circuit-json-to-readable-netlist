import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"

it("renders I3C, SMBus, and PMBus aliases for generic chip pins", () => {
  const circuitJson = [
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_controller",
      name: "U1",
      manufacturer_part_number: "I3C controller",
    },
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_sensor",
      name: "U2",
      manufacturer_part_number: "I3C sensor",
    },
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_power",
      name: "U3",
      manufacturer_part_number: "PMBus regulator",
    },
    {
      type: "source_port",
      source_port_id: "source_port_controller_sda0",
      source_component_id: "source_component_controller",
      name: "pin10",
      pin_number: 10,
      port_hints: ["I3C_SDA0"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_sensor_sda0",
      source_component_id: "source_component_sensor",
      name: "pin1",
      pin_number: 1,
      port_hints: ["SDA0"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_controller_scl0",
      source_component_id: "source_component_controller",
      name: "pin11",
      pin_number: 11,
      port_hints: ["I3C_SCL0"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_sensor_scl0",
      source_component_id: "source_component_sensor",
      name: "pin2",
      pin_number: 2,
      port_hints: ["SCL0"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_controller_smbalert",
      source_component_id: "source_component_controller",
      name: "pin12",
      pin_number: 12,
      port_hints: ["SMBALERT"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_power_smbalert",
      source_component_id: "source_component_power",
      name: "pin3",
      pin_number: 3,
      port_hints: ["SMB_ALERT"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_controller_pmbalert",
      source_component_id: "source_component_controller",
      name: "pin13",
      pin_number: 13,
      port_hints: ["PMBALERT"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_power_pmbalert",
      source_component_id: "source_component_power",
      name: "pin4",
      pin_number: 4,
      port_hints: ["PMBUS_ALERT"],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_sda0",
      connected_source_port_ids: [
        "source_port_controller_sda0",
        "source_port_sensor_sda0",
      ],
      connected_source_net_ids: [],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_scl0",
      connected_source_port_ids: [
        "source_port_controller_scl0",
        "source_port_sensor_scl0",
      ],
      connected_source_net_ids: [],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_smbalert",
      connected_source_port_ids: [
        "source_port_controller_smbalert",
        "source_port_power_smbalert",
      ],
      connected_source_net_ids: [],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_pmbalert",
      connected_source_port_ids: [
        "source_port_controller_pmbalert",
        "source_port_power_pmbalert",
      ],
      connected_source_net_ids: [],
    },
  ]

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson as any)

  expect(netlist).toContain("NET: U1_I3C_SDA0")
  expect(netlist).toContain("  - U1 pin10 (I3C_SDA0)")
  expect(netlist).toContain("  - U2 pin1 (SDA0)")
  expect(netlist).toContain("NET: U1_I3C_SCL0")
  expect(netlist).toContain("  - U1 pin11 (I3C_SCL0)")
  expect(netlist).toContain("  - U2 pin2 (SCL0)")
  expect(netlist).toContain("NET: U1_SMBALERT")
  expect(netlist).toContain("  - U1 pin12 (SMBALERT)")
  expect(netlist).toContain("  - U3 pin3 (SMB_ALERT)")
  expect(netlist).toContain("NET: U1_PMBALERT")
  expect(netlist).toContain("  - U1 pin13 (PMBALERT)")
  expect(netlist).toContain("  - U3 pin4 (PMBUS_ALERT)")
  expect(netlist).not.toContain("NET: U1_pin10")
})
