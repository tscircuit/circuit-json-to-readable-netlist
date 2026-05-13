import { expect, it } from "bun:test"
import type { AnyCircuitElement } from "circuit-json"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"

it("keeps IMU motion and data-ready aliases readable", () => {
  const circuitJson: AnyCircuitElement[] = [
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_imu",
      name: "U1",
      manufacturer_part_number: "ICM-20948",
    },
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_mcu",
      name: "U2",
      manufacturer_part_number: "ESP32",
    },
    {
      type: "source_port",
      source_port_id: "source_port_motion_int",
      source_component_id: "source_component_imu",
      name: "pin8",
      pin_number: 8,
      port_hints: ["8", "pin8", "MOTION_INT", "IMU_INT"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_mcu_motion_int",
      source_component_id: "source_component_mcu",
      name: "pin24",
      pin_number: 24,
      port_hints: ["24", "pin24", "GPIO_INTERRUPT"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_imu_ready",
      source_component_id: "source_component_imu",
      name: "pin9",
      pin_number: 9,
      port_hints: ["9", "pin9", "IMU_DATA_READY", "ACCELEROMETER"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_mcu_imu_ready",
      source_component_id: "source_component_mcu",
      name: "pin25",
      pin_number: 25,
      port_hints: ["25", "pin25", "GPIO_READY"],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_motion_int",
      connected_source_port_ids: [
        "source_port_motion_int",
        "source_port_mcu_motion_int",
      ],
      connected_source_net_ids: [],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_imu_ready",
      connected_source_port_ids: [
        "source_port_imu_ready",
        "source_port_mcu_imu_ready",
      ],
      connected_source_net_ids: [],
    },
  ]

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_MOTION_INT")
  expect(netlist).toContain("  - U1 pin8 (MOTION_INT,IMU_INT)")
  expect(netlist).toContain("NET: U1_IMU_DATA_READY")
  expect(netlist).toContain("  - U1 pin9 (IMU_DATA_READY,ACCELEROMETER)")
  expect(netlist).not.toContain("undefined")
})
