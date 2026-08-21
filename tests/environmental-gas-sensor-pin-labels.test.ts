import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"

it("preserves environmental and gas sensor aliases for generic chip pins", () => {
  const circuitJson = [
    {
      type: "source_component",
      source_component_id: "source_component_u1",
      ftype: "simple_chip",
      name: "U1",
    },
    {
      type: "source_component",
      source_component_id: "source_component_r1",
      ftype: "simple_resistor",
      name: "R1",
      display_resistance: "10k",
    },
    {
      type: "source_port",
      source_port_id: "source_port_u1_14",
      source_component_id: "source_component_u1",
      name: "pin14",
      pin_number: 14,
      port_hints: [
        "pin14",
        "14",
        "PRESS_INT",
        "HUM_DRDY",
        "VOC_INT",
        "CO2_RDY",
        "PM25_OUT",
      ],
    },
    {
      type: "source_port",
      source_port_id: "source_port_r1_1",
      source_component_id: "source_component_r1",
      name: "pin1",
      pin_number: 1,
      port_hints: ["anode", "pos", "left", "pin1", "1"],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_1",
      connected_source_port_ids: ["source_port_u1_14", "source_port_r1_1"],
      connected_source_net_ids: [],
    },
  ] as any

  const readableNetlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(readableNetlist).toContain("NET: U1_PRESS_INT")
  expect(readableNetlist).toContain(
    "  - U1 pin14 (PRESS_INT,HUM_DRDY,VOC_INT,CO2_RDY,PM25_OUT)",
  )
  expect(readableNetlist).toContain(
    "- pin14(PRESS_INT, HUM_DRDY, VOC_INT, CO2_RDY, PM25_OUT): NETS(U1_PRESS_INT)",
  )
})
