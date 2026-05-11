import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"

declare module "bun:test" {
  interface Matchers<T = unknown> {
    toMatchInlineSnapshot(snapshot?: string | null): Promise<MatcherResult>
  }
}

it("uses USB differential aliases for generic chip pin labels", () => {
  const circuitJson: any[] = [
    {
      type: "source_component",
      source_component_id: "source_component_0",
      ftype: "simple_chip",
      name: "U1",
      manufacturer_part_number: "USB2514B",
    },
    {
      type: "source_component",
      source_component_id: "source_component_1",
      ftype: "simple_chip",
      name: "J1",
      manufacturer_part_number: "USB-C",
    },
    {
      type: "source_port",
      source_port_id: "source_port_0",
      source_component_id: "source_component_0",
      name: "pin14",
      pin_number: 14,
      port_hints: ["USB_DP", "D+"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_1",
      source_component_id: "source_component_1",
      name: "pin1",
      pin_number: 1,
      port_hints: ["DP"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_2",
      source_component_id: "source_component_0",
      name: "pin15",
      pin_number: 15,
      port_hints: ["USB_DM", "D-"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_3",
      source_component_id: "source_component_1",
      name: "pin2",
      pin_number: 2,
      port_hints: ["DM"],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_0",
      connected_source_port_ids: ["source_port_0", "source_port_1"],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_1",
      connected_source_port_ids: ["source_port_2", "source_port_3"],
    },
  ]

  expect(
    convertCircuitJsonToReadableNetlist(circuitJson),
  ).toMatchInlineSnapshot(`
    "COMPONENTS:
     - U1: USB2514B
     - J1: USB-C

    NET: U1_USB_DP
      - U1 pin14 (USB_DP,D+)
      - J1 pin1 (DP)

    NET: U1_USB_DM
      - U1 pin15 (USB_DM,D-)
      - J1 pin2 (DM)


    COMPONENT_PINS:
    U1 (USB2514B)
    - pin14(USB_DP, D+): NETS(U1_USB_DP)
    - pin15(USB_DM, D-): NETS(U1_USB_DM)

    J1 (USB-C)
    - pin1(DP): NETS(U1_USB_DP)
    - pin2(DM): NETS(U1_USB_DM)
    "
  `)
})
