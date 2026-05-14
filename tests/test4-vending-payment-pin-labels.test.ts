import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"

it("preserves vending payment peripheral aliases on generic pin labels", () => {
  const circuitJson: Parameters<typeof convertCircuitJsonToReadableNetlist>[0] =
    [
      {
        type: "source_component",
        ftype: "simple_chip",
        source_component_id: "source_component_0",
        name: "U1",
        manufacturer_part_number: "VEND-CTRL",
      },
      {
        type: "source_component",
        ftype: "simple_chip",
        source_component_id: "source_component_1",
        name: "J1",
        manufacturer_part_number: "PAYMENT_IO",
      },
      {
        type: "source_port",
        source_port_id: "source_port_0",
        source_component_id: "source_component_0",
        name: "pin14",
        pin_number: 14,
        port_hints: ["MDB_TX1"],
      },
      {
        type: "source_port",
        source_port_id: "source_port_1",
        source_component_id: "source_component_1",
        name: "pin1",
        pin_number: 1,
        port_hints: ["MDB_BUS"],
      },
      {
        type: "source_port",
        source_port_id: "source_port_2",
        source_component_id: "source_component_0",
        name: "pin15",
        pin_number: 15,
        port_hints: ["CCTALK_DATA1"],
      },
      {
        type: "source_port",
        source_port_id: "source_port_3",
        source_component_id: "source_component_1",
        name: "pin2",
        pin_number: 2,
        port_hints: ["COIN_PULSE1"],
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

  expect(readableNetlist).toContain("NET: U1_MDB_TX1")
  expect(readableNetlist).toContain("  - U1 pin14 (MDB_TX1)")
  expect(readableNetlist).toContain("  - J1 pin1 (MDB_BUS)")
  expect(readableNetlist).toContain("NET: U1_CCTALK_DATA1")
  expect(readableNetlist).toContain("  - U1 pin15 (CCTALK_DATA1)")
  expect(readableNetlist).toContain("  - J1 pin2 (COIN_PULSE1)")
})
