import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"

declare module "bun:test" {
  interface Matchers<T = unknown> {
    toMatchInlineSnapshot(snapshot?: string | null): Promise<MatcherResult>
  }
}

it("preserves thermal imager aliases in net names and pin labels", () => {
  const circuitJson = [
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_0",
      name: "U1",
      manufacturer_part_number: "LEPTON_LIKE_THERMAL_CORE",
    },
    {
      type: "cad_component",
      cad_component_id: "cad_component_0",
      source_component_id: "source_component_0",
      footprinter_string: "qfn16",
    },
    {
      type: "source_component",
      ftype: "simple_resistor",
      source_component_id: "source_component_1",
      name: "R1",
      display_resistance: "10kΩ",
    },
    {
      type: "cad_component",
      cad_component_id: "cad_component_1",
      source_component_id: "source_component_1",
      footprinter_string: "0402",
    },
    {
      type: "source_component",
      ftype: "simple_resistor",
      source_component_id: "source_component_2",
      name: "R2",
      display_resistance: "10kΩ",
    },
    {
      type: "cad_component",
      cad_component_id: "cad_component_2",
      source_component_id: "source_component_2",
      footprinter_string: "0402",
    },
    {
      type: "source_component",
      ftype: "simple_resistor",
      source_component_id: "source_component_3",
      name: "R3",
      display_resistance: "10kΩ",
    },
    {
      type: "cad_component",
      cad_component_id: "cad_component_3",
      source_component_id: "source_component_3",
      footprinter_string: "0402",
    },
    {
      type: "source_port",
      source_port_id: "source_port_0",
      source_component_id: "source_component_0",
      name: "pin14",
      pin_number: 1,
      port_hints: ["BOL_SYNC1"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_1",
      source_component_id: "source_component_0",
      name: "pin15",
      pin_number: 2,
      port_hints: ["NUC_SHUTTER1"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_2",
      source_component_id: "source_component_0",
      name: "pin16",
      pin_number: 3,
      port_hints: ["FRAME_VALID1"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_3",
      source_component_id: "source_component_1",
      name: "pin1",
      pin_number: 1,
      port_hints: ["anode", "pos", "left"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_4",
      source_component_id: "source_component_2",
      name: "pin1",
      pin_number: 1,
      port_hints: ["anode", "pos", "left"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_5",
      source_component_id: "source_component_3",
      name: "pin1",
      pin_number: 1,
      port_hints: ["anode", "pos", "left"],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_0",
      connected_source_port_ids: ["source_port_0", "source_port_3"],
      connected_source_net_ids: [],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_1",
      connected_source_port_ids: ["source_port_1", "source_port_4"],
      connected_source_net_ids: [],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_2",
      connected_source_port_ids: ["source_port_2", "source_port_5"],
      connected_source_net_ids: [],
    },
  ] as any

  expect(
    convertCircuitJsonToReadableNetlist(circuitJson),
  ).toMatchInlineSnapshot(`
    "COMPONENTS:
     - U1: LEPTON_LIKE_THERMAL_CORE, qfn16
     - R1: 10kΩ 0402 resistor
     - R2: 10kΩ 0402 resistor
     - R3: 10kΩ 0402 resistor

    NET: U1_BOL_SYNC1
      - U1 pin14 (BOL_SYNC1)
      - R1 pin1

    NET: U1_NUC_SHUTTER1
      - U1 pin15 (NUC_SHUTTER1)
      - R2 pin1

    NET: U1_FRAME_VALID1
      - U1 pin16 (FRAME_VALID1)
      - R3 pin1


    COMPONENT_PINS:
    U1 (LEPTON_LIKE_THERMAL_CORE)
    - pin1(pin14, BOL_SYNC1): NETS(U1_BOL_SYNC1)
    - pin2(pin15, NUC_SHUTTER1): NETS(U1_NUC_SHUTTER1)
    - pin3(pin16, FRAME_VALID1): NETS(U1_FRAME_VALID1)

    R1 (10kΩ 0402)
    - pin1(anode, pos, left): NETS(U1_BOL_SYNC1)

    R2 (10kΩ 0402)
    - pin1(anode, pos, left): NETS(U1_NUC_SHUTTER1)

    R3 (10kΩ 0402)
    - pin1(anode, pos, left): NETS(U1_FRAME_VALID1)
    "
  `)
})
