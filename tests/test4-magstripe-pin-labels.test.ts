import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"

it("preserves magstripe reader aliases on generic pin labels", () => {
  const circuitJson: Parameters<typeof convertCircuitJsonToReadableNetlist>[0] =
    [
      {
        type: "source_component",
        ftype: "simple_chip",
        source_component_id: "source_component_0",
        name: "U1",
        manufacturer_part_number: "MSR-CTRL",
      },
      {
        type: "source_component",
        ftype: "simple_chip",
        source_component_id: "source_component_1",
        name: "J1",
        manufacturer_part_number: "MAGSTRIPE_HEAD",
      },
      {
        type: "source_port",
        source_port_id: "source_port_0",
        source_component_id: "source_component_0",
        name: "pin14",
        pin_number: 14,
        port_hints: ["MSR_TRACK1_DATA"],
      },
      {
        type: "source_port",
        source_port_id: "source_port_1",
        source_component_id: "source_component_1",
        name: "pin1",
        pin_number: 1,
        port_hints: ["TRACK1"],
      },
      {
        type: "source_port",
        source_port_id: "source_port_2",
        source_component_id: "source_component_0",
        name: "pin15",
        pin_number: 15,
        port_hints: ["MAGSTRIPE_STROBE1"],
      },
      {
        type: "source_port",
        source_port_id: "source_port_3",
        source_component_id: "source_component_1",
        name: "pin2",
        pin_number: 2,
        port_hints: ["F2F_DATA"],
      },
      {
        type: "source_trace",
        source_trace_id: "source_trace_0",
        connected_source_port_ids: ["source_port_0", "source_port_1"],
        connected_source_net_ids: [],
      },
      {
        type: "source_trace",
        source_trace_id: "source_trace_1",
        connected_source_port_ids: ["source_port_2", "source_port_3"],
        connected_source_net_ids: [],
      },
    ]

  const readableNetlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(readableNetlist).toContain("NET: U1_MSR_TRACK1_DATA")
  expect(readableNetlist).toContain("  - U1 pin14 (MSR_TRACK1_DATA)")
  expect(readableNetlist).toContain("  - J1 pin1 (TRACK1)")
  expect(readableNetlist).toContain("NET: U1_MAGSTRIPE_STROBE1")
  expect(readableNetlist).toContain("  - U1 pin15 (MAGSTRIPE_STROBE1)")
  expect(readableNetlist).toContain("  - J1 pin2 (F2F_DATA)")
})
