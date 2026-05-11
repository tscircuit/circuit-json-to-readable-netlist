import { expect, it } from "bun:test"
import type { AnyCircuitElement } from "circuit-json"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"

declare module "bun:test" {
  interface Matchers<T = unknown> {
    toMatchInlineSnapshot(snapshot?: string | null): Promise<MatcherResult>
  }
}

it("preserves PDM and DMIC microphone pin aliases in readable net entries", () => {
  const circuitJson: AnyCircuitElement[] = [
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_0",
      name: "U1",
      manufacturer_part_number: "AUDIO_CODEC",
    },
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_1",
      name: "J1",
      manufacturer_part_number: "MIC_HEADER",
    },
    {
      type: "source_port",
      source_port_id: "source_port_0",
      source_component_id: "source_component_0",
      name: "pin14",
      pin_number: 14,
      port_hints: ["PDM1_CLK"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_1",
      source_component_id: "source_component_1",
      name: "pin1",
      pin_number: 1,
      port_hints: ["pos"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_2",
      source_component_id: "source_component_0",
      name: "pin15",
      pin_number: 15,
      port_hints: ["PDM1_DATA"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_3",
      source_component_id: "source_component_1",
      name: "pin2",
      pin_number: 2,
      port_hints: ["PDM1_DATA"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_4",
      source_component_id: "source_component_0",
      name: "pin16",
      pin_number: 16,
      port_hints: ["DMIC0_CLK"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_5",
      source_component_id: "source_component_1",
      name: "pin3",
      pin_number: 3,
      port_hints: ["DMIC0_CLK"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_6",
      source_component_id: "source_component_0",
      name: "pin17",
      pin_number: 17,
      port_hints: ["DMIC0_DAT"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_7",
      source_component_id: "source_component_1",
      name: "pin4",
      pin_number: 4,
      port_hints: ["DMIC0_DAT"],
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
    {
      type: "source_trace",
      source_trace_id: "source_trace_2",
      connected_source_port_ids: ["source_port_4", "source_port_5"],
      connected_source_net_ids: [],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_3",
      connected_source_port_ids: ["source_port_6", "source_port_7"],
      connected_source_net_ids: [],
    },
  ]

  expect(
    convertCircuitJsonToReadableNetlist(circuitJson),
  ).toMatchInlineSnapshot(`
    "COMPONENTS:
     - U1: AUDIO_CODEC
     - J1: MIC_HEADER

    NET: U1_PDM1_CLK
      - U1 pin14 (PDM1_CLK)
      - J1 pin1 (+)

    NET: U1_PDM1_DATA
      - U1 pin15 (PDM1_DATA)
      - J1 pin2 (PDM1_DATA)

    NET: U1_DMIC0_CLK
      - U1 pin16 (DMIC0_CLK)
      - J1 pin3 (DMIC0_CLK)

    NET: U1_DMIC0_DAT
      - U1 pin17 (DMIC0_DAT)
      - J1 pin4 (DMIC0_DAT)


    COMPONENT_PINS:
    U1 (AUDIO_CODEC)
    - pin14(PDM1_CLK): NETS(U1_PDM1_CLK)
    - pin15(PDM1_DATA): NETS(U1_PDM1_DATA)
    - pin16(DMIC0_CLK): NETS(U1_DMIC0_CLK)
    - pin17(DMIC0_DAT): NETS(U1_DMIC0_DAT)

    J1 (MIC_HEADER)
    - pin1(pos): NETS(U1_PDM1_CLK)
    - pin2(PDM1_DATA): NETS(U1_PDM1_DATA)
    - pin3(DMIC0_CLK): NETS(U1_DMIC0_CLK)
    - pin4(DMIC0_DAT): NETS(U1_DMIC0_DAT)
    "
  `)
})
