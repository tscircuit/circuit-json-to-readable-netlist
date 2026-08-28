import { expect, it } from "bun:test"
import type { AnyCircuitElement } from "circuit-json"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"

it("preserves camera interface aliases in readable netlists", () => {
  const circuitJson: AnyCircuitElement[] = [
    {
      type: "source_component",
      source_component_id: "source_component_camera",
      name: "CAM1",
      ftype: "simple_chip",
      manufacturer_part_number: "IMX219",
    },
    {
      type: "source_component",
      source_component_id: "source_component_connector",
      name: "J1",
      ftype: "simple_chip",
      manufacturer_part_number: "FFC_22P",
    },
    {
      type: "source_port",
      source_port_id: "source_port_camera_d0p",
      source_component_id: "source_component_camera",
      name: "pin14",
      pin_number: 14,
      port_hints: ["MIPI_CSI_D0P", "pos"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_connector_d0p",
      source_component_id: "source_component_connector",
      name: "pin1",
      pin_number: 1,
      port_hints: ["pos"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_camera_mclk",
      source_component_id: "source_component_camera",
      name: "pin6",
      pin_number: 6,
      port_hints: ["CAM_MCLK"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_connector_mclk",
      source_component_id: "source_component_connector",
      name: "pin2",
      pin_number: 2,
      port_hints: ["right"],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_camera_d0p",
      connected_source_port_ids: [
        "source_port_camera_d0p",
        "source_port_connector_d0p",
      ],
      connected_source_net_ids: [],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_camera_mclk",
      connected_source_port_ids: [
        "source_port_camera_mclk",
        "source_port_connector_mclk",
      ],
      connected_source_net_ids: [],
    },
  ]

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: CAM1_MIPI_CSI_D0P")
  expect(netlist).toContain("  - CAM1 pin14 (+,MIPI_CSI_D0P)")
  expect(netlist).toContain("NET: CAM1_CAM_MCLK")
  expect(netlist).toContain("  - CAM1 pin6 (CAM_MCLK)")
  expect(netlist).not.toContain("NET: CAM1_pos")
})
