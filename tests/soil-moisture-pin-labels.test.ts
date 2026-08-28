import { expect, it } from "bun:test"
import type { AnyCircuitElement } from "circuit-json"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"

it("preserves soil moisture sensor pin labels", () => {
  const circuitJson: AnyCircuitElement[] = [
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_u1",
      name: "U1",
      manufacturer_part_number: "AGRO_SENSOR_MCU",
    },
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_u2",
      name: "U2",
      manufacturer_part_number: "ADC_FRONTEND",
    },
    {
      type: "source_port",
      source_port_id: "source_port_u1_soil",
      source_component_id: "source_component_u1",
      name: "pin14",
      pin_number: 14,
      port_hints: ["14", "pos", "SOIL_MOIST1", "VWC1", "TENSIOMETER1"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_u2_input",
      source_component_id: "source_component_u2",
      name: "SENSOR_IN",
      pin_number: 1,
      port_hints: ["SENSOR_IN"],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_soil",
      connected_source_port_ids: [
        "source_port_u1_soil",
        "source_port_u2_input",
      ],
      connected_source_net_ids: [],
    },
  ] as AnyCircuitElement[]

  expect(
    convertCircuitJsonToReadableNetlist(circuitJson),
  ).toMatchInlineSnapshot(`
      "COMPONENTS:
       - U1: AGRO_SENSOR_MCU
       - U2: ADC_FRONTEND

      NET: U1_SOIL_MOIST1
        - U1 pin14 (+,SOIL_MOIST1,VWC1,TENSIOMETER1)
        - U2 SENSOR_IN


      COMPONENT_PINS:
      U1 (AGRO_SENSOR_MCU)
      - pin14(pos, SOIL_MOIST1, VWC1, TENSIOMETER1): NETS(U1_SOIL_MOIST1)

      U2 (ADC_FRONTEND)
      - pin1(SENSOR_IN): NETS(U1_SOIL_MOIST1)
      "
    `)
})
