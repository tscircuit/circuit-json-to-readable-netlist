import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"

declare module "bun:test" {
  interface Matchers<T = unknown> {
    toMatchInlineSnapshot(snapshot?: string | null): Promise<MatcherResult>
  }
}

it("keeps JTAG aliases on generic chip pins", () => {
  const circuitJson = [
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_u1",
      name: "U1",
      manufacturer_part_number: "RP2040",
    },
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_j1",
      name: "J1",
      manufacturer_part_number: "JTAG_HEADER",
    },
    {
      type: "source_port",
      source_port_id: "source_port_u1_pin14",
      source_component_id: "source_component_u1",
      name: "pin14",
      pin_number: 14,
      port_hints: ["TCK"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_j1_pin1",
      source_component_id: "source_component_j1",
      name: "pin1",
      pin_number: 1,
      port_hints: ["TCK"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_u1_pin15",
      source_component_id: "source_component_u1",
      name: "pin15",
      pin_number: 15,
      port_hints: ["TMS"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_j1_pin2",
      source_component_id: "source_component_j1",
      name: "pin2",
      pin_number: 2,
      port_hints: ["TMS"],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_tck",
      connected_source_port_ids: [
        "source_port_u1_pin14",
        "source_port_j1_pin1",
      ],
      connected_source_net_ids: [],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_tms",
      connected_source_port_ids: [
        "source_port_u1_pin15",
        "source_port_j1_pin2",
      ],
      connected_source_net_ids: [],
    },
  ] as any

  expect(
    convertCircuitJsonToReadableNetlist(circuitJson),
  ).toMatchInlineSnapshot(`
    "COMPONENTS:
     - U1: RP2040
     - J1: JTAG_HEADER

    NET: U1_TCK
      - U1 pin14 (TCK)
      - J1 pin1 (TCK)

    NET: U1_TMS
      - U1 pin15 (TMS)
      - J1 pin2 (TMS)


    COMPONENT_PINS:
    U1 (RP2040)
    - pin14(TCK): NETS(U1_TCK)
    - pin15(TMS): NETS(U1_TMS)

    J1 (JTAG_HEADER)
    - pin1(TCK): NETS(U1_TCK)
    - pin2(TMS): NETS(U1_TMS)
    "
  `)
})
