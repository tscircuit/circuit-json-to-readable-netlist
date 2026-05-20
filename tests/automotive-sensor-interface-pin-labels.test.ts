import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"

declare module "bun:test" {
  interface Matchers<T = unknown> {
    toMatchInlineSnapshot(snapshot?: string | null): Promise<MatcherResult>
  }
}

it("preserves SENT and PSI5 automotive sensor-interface labels", () => {
  const circuitJson: any[] = [
    {
      type: "source_component",
      source_component_id: "source_component_0",
      ftype: "simple_chip",
      name: "U1",
      manufacturer_part_number: "SENT-PSI5",
    },
    {
      type: "source_port",
      source_port_id: "source_port_0",
      name: "pin14",
      pin_number: 14,
      port_hints: ["pin14", "SENT_OUT1", "SENT_SYNC1"],
      source_component_id: "source_component_0",
    },
    {
      type: "source_port",
      source_port_id: "source_port_1",
      name: "pin15",
      pin_number: 15,
      port_hints: ["pin15", "PSI5_DATA1", "PSI5_SYNC1"],
      source_component_id: "source_component_0",
    },
    {
      type: "source_component",
      source_component_id: "source_component_1",
      ftype: "simple_resistor",
      name: "R1",
      display_resistance: "1kΩ",
    },
    {
      type: "source_port",
      source_port_id: "source_port_2",
      name: "pin1",
      pin_number: 1,
      port_hints: ["anode", "pos", "left", "pin1", "1"],
      source_component_id: "source_component_1",
    },
    {
      type: "source_port",
      source_port_id: "source_port_3",
      name: "pin2",
      pin_number: 2,
      port_hints: ["cathode", "neg", "right", "pin2", "2"],
      source_component_id: "source_component_1",
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
  ]

  expect(
    convertCircuitJsonToReadableNetlist(circuitJson),
  ).toMatchInlineSnapshot(`
      "COMPONENTS:
       - U1: SENT-PSI5
       - R1: 1kΩ resistor

      NET: U1_SENT_OUT1
        - U1 pin14 (SENT_OUT1,SENT_SYNC1)
        - R1 pin1

      NET: U1_PSI5_DATA1
        - U1 pin15 (PSI5_DATA1,PSI5_SYNC1)
        - R1 pin2


      COMPONENT_PINS:
      U1 (SENT-PSI5)
      - pin14(SENT_OUT1, SENT_SYNC1): NETS(U1_SENT_OUT1)
      - pin15(PSI5_DATA1, PSI5_SYNC1): NETS(U1_PSI5_DATA1)

      R1 (1kΩ undefined)
      - pin1(anode, pos, left): NETS(U1_SENT_OUT1)
      - pin2(cathode, neg, right): NETS(U1_PSI5_DATA1)
      "
    `)
})
