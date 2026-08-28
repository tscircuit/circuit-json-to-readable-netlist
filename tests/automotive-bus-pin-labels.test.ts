import { expect, it } from "bun:test"
import type { AnyCircuitElement } from "circuit-json"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"

declare module "bun:test" {
  interface Matchers<T = unknown> {
    toMatchInlineSnapshot(snapshot?: string | null): Promise<MatcherResult>
  }
}

it("preserves automotive bus labels with numeric suffixes", () => {
  const circuitJson: AnyCircuitElement[] = [
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_1",
      name: "U1",
      manufacturer_part_number: "TJA1051",
    },
    {
      type: "source_component",
      ftype: "simple_capacitor",
      source_component_id: "source_component_2",
      name: "C1",
      capacitance: 0.0000001,
      display_capacitance: "100nF",
    },
    {
      type: "source_component",
      ftype: "simple_resistor",
      source_component_id: "source_component_3",
      name: "R1",
      resistance: 120,
      display_resistance: "120Ω",
    },
    {
      type: "cad_component",
      cad_component_id: "cad_component_1",
      pcb_component_id: "pcb_component_1",
      source_component_id: "source_component_1",
      position: { x: 0, y: 0, z: 0 },
      footprinter_string: "soic8",
    },
    {
      type: "cad_component",
      cad_component_id: "cad_component_2",
      pcb_component_id: "pcb_component_2",
      source_component_id: "source_component_2",
      position: { x: 0, y: 0, z: 0 },
      footprinter_string: "0402",
    },
    {
      type: "cad_component",
      cad_component_id: "cad_component_3",
      pcb_component_id: "pcb_component_3",
      source_component_id: "source_component_3",
      position: { x: 0, y: 0, z: 0 },
      footprinter_string: "0402",
    },
    {
      type: "source_port",
      source_port_id: "source_port_1",
      source_component_id: "source_component_1",
      name: "pin14",
      port_hints: ["CANH1"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_2",
      source_component_id: "source_component_1",
      name: "pin15",
      port_hints: ["CANL1"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_3",
      source_component_id: "source_component_1",
      name: "pin16",
      port_hints: ["LIN_BUS1"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_4",
      source_component_id: "source_component_2",
      name: "pin1",
      port_hints: ["pos", "anode", "left"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_5",
      source_component_id: "source_component_2",
      name: "pin2",
      port_hints: ["neg", "cathode", "right"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_6",
      source_component_id: "source_component_3",
      name: "pin1",
      port_hints: ["anode", "pos", "left"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_7",
      source_component_id: "source_component_3",
      name: "pin2",
      port_hints: ["cathode", "neg", "right"],
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
      connected_source_port_ids: ["source_port_2", "source_port_6"],
      connected_source_net_ids: [],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_3",
      connected_source_port_ids: ["source_port_3", "source_port_5"],
      connected_source_net_ids: [],
    },
  ]

  expect(
    convertCircuitJsonToReadableNetlist(circuitJson),
  ).toMatchInlineSnapshot(`
    "COMPONENTS:
     - U1: TJA1051, soic8
     - C1: 100nF 0402 capacitor
     - R1: 120Ω 0402 resistor

    NET: U1_CANH1
      - U1 pin14 (CANH1)
      - C1 pin1 (+)

    NET: U1_CANL1
      - U1 pin15 (CANL1)
      - R1 pin1

    NET: U1_LIN_BUS1
      - U1 pin16 (LIN_BUS1)
      - C1 pin2 (-)


    COMPONENT_PINS:
    U1 (TJA1051)
    - pin14(CANH1): NETS(U1_CANH1)
    - pin15(CANL1): NETS(U1_CANL1)
    - pin16(LIN_BUS1): NETS(U1_LIN_BUS1)

    C1 (100nF 0402)
    - pin1(pos, anode, left): NETS(U1_CANH1)
    - pin2(neg, cathode, right): NETS(U1_LIN_BUS1)

    R1 (120Ω 0402)
    - pin1(anode, pos, left): NETS(U1_CANL1)
    - pin2(cathode, neg, right): NOT_CONNECTED
    "
  `)
})
