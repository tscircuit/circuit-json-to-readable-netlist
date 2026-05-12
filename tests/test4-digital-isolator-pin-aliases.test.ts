import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"

declare module "bun:test" {
  interface Matchers<T = unknown> {
    toMatchInlineSnapshot(snapshot?: string | null): Promise<MatcherResult>
  }
}

it("keeps digital isolator aliases for generic chip pin labels", () => {
  const circuitJson = [
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_0",
      name: "U1",
      manufacturer_part_number: "ADUM_DIGITAL_ISOLATOR",
    },
    {
      type: "source_port",
      source_port_id: "source_port_0",
      source_component_id: "source_component_0",
      name: "pin14",
      pin_number: 14,
      port_hints: ["ISO_IN1"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_1",
      source_component_id: "source_component_0",
      name: "pin15",
      pin_number: 15,
      port_hints: ["ADUM_TX1"],
    },
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_1",
      name: "U2",
      manufacturer_part_number: "MCU_HEADER",
    },
    {
      type: "source_port",
      source_port_id: "source_port_2",
      source_component_id: "source_component_1",
      name: "pin1",
      pin_number: 1,
      port_hints: ["ISO_OUT1"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_3",
      source_component_id: "source_component_1",
      name: "pin2",
      pin_number: 2,
      port_hints: ["ADUM_RX1"],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_0",
      connected_source_port_ids: ["source_port_0", "source_port_2"],
      connected_source_net_ids: [],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_1",
      connected_source_port_ids: ["source_port_1", "source_port_3"],
      connected_source_net_ids: [],
    },
  ] as any

  expect(
    convertCircuitJsonToReadableNetlist(circuitJson),
  ).toMatchInlineSnapshot(`
    "COMPONENTS:
     - U1: ADUM_DIGITAL_ISOLATOR
     - U2: MCU_HEADER

    NET: U1_ISO_IN1
      - U1 pin14 (ISO_IN1)
      - U2 pin1 (ISO_OUT1)

    NET: U1_ADUM_TX1
      - U1 pin15 (ADUM_TX1)
      - U2 pin2 (ADUM_RX1)


    COMPONENT_PINS:
    U1 (ADUM_DIGITAL_ISOLATOR)
    - pin14(ISO_IN1): NETS(U1_ISO_IN1)
    - pin15(ADUM_TX1): NETS(U1_ADUM_TX1)

    U2 (MCU_HEADER)
    - pin1(ISO_OUT1): NETS(U1_ISO_IN1)
    - pin2(ADUM_RX1): NETS(U1_ADUM_TX1)
    "
  `)
})
