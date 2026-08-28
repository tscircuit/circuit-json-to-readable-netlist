import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"

it("preserves GNSS and precision time-sync pin labels", () => {
  const circuitJson = [
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_gnss",
      name: "U1",
      manufacturer_part_number: "GNSS-MODULE",
    },
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_mcu",
      name: "U2",
      manufacturer_part_number: "TIMEKEEPER-MCU",
    },
    {
      type: "source_port",
      source_port_id: "source_port_gnss_pps",
      source_component_id: "source_component_gnss",
      name: "pin14",
      pin_number: 14,
      port_hints: ["14", "GNSS_PPS", "1PPS"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_mcu_pps",
      source_component_id: "source_component_mcu",
      name: "pin2",
      pin_number: 2,
      port_hints: ["2", "PPS_IN"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_ptp_sync",
      source_component_id: "source_component_mcu",
      name: "pin8",
      pin_number: 8,
      port_hints: ["8", "PTP_SYNC", "CLKOUT"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_ptp_header",
      source_component_id: "source_component_gnss",
      name: "pin3",
      pin_number: 3,
      port_hints: ["3", "PTP_SYNC_OUT"],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_pps",
      connected_source_port_ids: [
        "source_port_gnss_pps",
        "source_port_mcu_pps",
      ],
      connected_source_net_ids: [],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_ptp",
      connected_source_port_ids: [
        "source_port_ptp_sync",
        "source_port_ptp_header",
      ],
      connected_source_net_ids: [],
    },
  ]

  const readableNetlist = convertCircuitJsonToReadableNetlist(
    circuitJson as any,
  )

  expect(readableNetlist).toContain("NET: U1_GNSS_PPS")
  expect(readableNetlist).toContain("  - U1 pin14 (GNSS_PPS,1PPS)")
  expect(readableNetlist).toContain("  - U2 pin2 (PPS_IN)")
  expect(readableNetlist).toContain("NET: U2_PTP_SYNC")
  expect(readableNetlist).toContain("  - U2 pin8 (PTP_SYNC,CLKOUT)")
  expect(readableNetlist).toContain("  - U1 pin3 (PTP_SYNC_OUT)")
  expect(readableNetlist).toContain(
    "- pin14(GNSS_PPS, 1PPS): NETS(U1_GNSS_PPS)",
  )
  expect(readableNetlist).toContain("- pin3(PTP_SYNC_OUT): NETS(U2_PTP_SYNC)")
  expect(readableNetlist).toContain(
    "- pin8(PTP_SYNC, CLKOUT): NETS(U2_PTP_SYNC)",
  )
})
