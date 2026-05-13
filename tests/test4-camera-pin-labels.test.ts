import { expect, it } from "bun:test"
import type { AnyCircuitElement } from "circuit-json"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"

it("keeps camera sensor pin aliases readable", () => {
  const circuitJson: AnyCircuitElement[] = [
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_camera",
      name: "U1",
      manufacturer_part_number: "OV5640",
    },
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_mcu",
      name: "U2",
      manufacturer_part_number: "ESP32-S3",
    },
    {
      type: "source_port",
      source_port_id: "source_port_camera_clock",
      source_component_id: "source_component_camera",
      name: "pin4",
      pin_number: 4,
      port_hints: ["4", "pin4", "CAMERA_PIXEL_CLOCK", "CAMERA_MASTER_CLOCK"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_mcu_camera_clock",
      source_component_id: "source_component_mcu",
      name: "pin18",
      pin_number: 18,
      port_hints: ["18", "pin18", "GPIO_CLOCK"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_camera_frame_valid",
      source_component_id: "source_component_camera",
      name: "pin5",
      pin_number: 5,
      port_hints: ["5", "pin5", "CAMERA_FRAME_VALID", "CAMERA_LINE_VALID"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_mcu_frame_valid",
      source_component_id: "source_component_mcu",
      name: "pin19",
      pin_number: 19,
      port_hints: ["19", "pin19", "GPIO_FRAME"],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_camera_clock",
      connected_source_port_ids: [
        "source_port_camera_clock",
        "source_port_mcu_camera_clock",
      ],
      connected_source_net_ids: [],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_camera_frame_valid",
      connected_source_port_ids: [
        "source_port_camera_frame_valid",
        "source_port_mcu_frame_valid",
      ],
      connected_source_net_ids: [],
    },
  ]

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_CAMERA_PIXEL_CLOCK")
  expect(netlist).toContain(
    "  - U1 pin4 (CAMERA_PIXEL_CLOCK,CAMERA_MASTER_CLOCK)",
  )
  expect(netlist).toContain("NET: U1_CAMERA_FRAME_VALID")
  expect(netlist).toContain(
    "  - U1 pin5 (CAMERA_FRAME_VALID,CAMERA_LINE_VALID)",
  )
  expect(netlist).not.toContain("undefined")
})
