import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"

declare module "bun:test" {
  interface Matchers<T = unknown> {
    toMatchInlineSnapshot(snapshot?: string | null): Promise<MatcherResult>
  }
}

it("shows UART flow-control aliases for generic chip pin labels", () => {
  const circuitJson = [
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_1",
      name: "U1",
      manufacturer_part_number: "UART-MCU",
    },
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_2",
      name: "J1",
      manufacturer_part_number: "UART-HEADER",
    },
    {
      type: "source_port",
      source_port_id: "source_port_1",
      source_component_id: "source_component_1",
      name: "pin14",
      pin_number: 14,
      port_hints: ["RTS"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_2",
      source_component_id: "source_component_2",
      name: "pin3",
      pin_number: 3,
      port_hints: ["CTS"],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_1",
      connected_source_port_ids: ["source_port_1", "source_port_2"],
      connected_source_net_ids: [],
    },
  ]

  expect(
    convertCircuitJsonToReadableNetlist(circuitJson as any),
  ).toMatchInlineSnapshot(`
    "COMPONENTS:
     - U1: UART-MCU
     - J1: UART-HEADER

    NET: U1_RTS
      - U1 pin14 (RTS)
      - J1 pin3 (CTS)


    COMPONENT_PINS:
    U1 (UART-MCU)
    - pin14(RTS): NETS(U1_RTS)

    J1 (UART-HEADER)
    - pin3(CTS): NETS(U1_RTS)
    "
  `)
})
