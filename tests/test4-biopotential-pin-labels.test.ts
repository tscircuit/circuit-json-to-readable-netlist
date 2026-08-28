import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"

it("preserves biopotential front-end aliases in readable pin labels", () => {
  const circuitJson = [
    {
      type: "source_component",
      source_component_id: "source_component_u1",
      ftype: "simple_chip",
      name: "U1",
      manufacturer_part_number: "ADS1292R",
    },
    {
      type: "source_component",
      source_component_id: "source_component_r1",
      ftype: "simple_resistor",
      name: "R1",
      display_resistance: "10k",
    },
    {
      type: "cad_component",
      cad_component_id: "cad_component_r1",
      source_component_id: "source_component_r1",
      footprinter_string: "0402",
    },
    {
      type: "source_port",
      source_port_id: "source_port_u1_pin14",
      source_component_id: "source_component_u1",
      name: "pin14",
      pin_number: 14,
      port_hints: ["ECG_IN1", "LEAD_OFF1", "RLD_DRV1", "14"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_r1_pin1",
      source_component_id: "source_component_r1",
      name: "pin1",
      pin_number: 1,
      port_hints: ["anode", "pos", "left", "pin1", "1"],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_ecg",
      connected_source_port_ids: [
        "source_port_u1_pin14",
        "source_port_r1_pin1",
      ],
      connected_source_net_ids: [],
    },
  ] as any

  expect(
    convertCircuitJsonToReadableNetlist(circuitJson),
  ).toMatchInlineSnapshot(`
    "COMPONENTS:
     - U1: ADS1292R
     - R1: 10k 0402 resistor

    NET: U1_ECG_IN1
      - U1 pin14 (ECG_IN1,LEAD_OFF1,RLD_DRV1)
      - R1 pin1


    COMPONENT_PINS:
    U1 (ADS1292R)
    - pin14(ECG_IN1, LEAD_OFF1, RLD_DRV1): NETS(U1_ECG_IN1)

    R1 (10k 0402)
    - pin1(anode, pos, left): NETS(U1_ECG_IN1)
    "
  `)
})
