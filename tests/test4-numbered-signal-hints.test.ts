import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"

it("uses known signal words before numeric fallback when scoring pin hints", () => {
  const circuitJson = [
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_0",
      name: "U1",
      manufacturer_part_number: "MCU-CTRL",
    },
    {
      type: "source_component",
      ftype: "simple_resistor",
      source_component_id: "source_component_1",
      name: "R1",
      resistance: 1000,
      display_resistance: "1k",
    },
    {
      type: "cad_component",
      cad_component_id: "cad_component_0",
      source_component_id: "source_component_1",
      footprinter_string: "0402",
    },
    {
      type: "source_port",
      source_port_id: "source_port_0",
      source_component_id: "source_component_0",
      name: "pin14",
      pin_number: 14,
      port_hints: ["14", "SCL1"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_1",
      source_component_id: "source_component_1",
      name: "pin1",
      pin_number: 1,
      port_hints: ["1", "left"],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_0",
      connected_source_port_ids: ["source_port_0", "source_port_1"],
      connected_source_net_ids: [],
    },
  ] as any

  expect(
    convertCircuitJsonToReadableNetlist(circuitJson),
  ).toMatchInlineSnapshot(`
      "COMPONENTS:
       - U1: MCU-CTRL
       - R1: 1k 0402 resistor

      NET: U1_SCL1
        - U1 pin14 (SCL1)
        - R1 pin1


      COMPONENT_PINS:
      U1 (MCU-CTRL)
      - pin14(SCL1): NETS(U1_SCL1)

      R1 (1k 0402)
      - pin1(left): NETS(U1_SCL1)
      "
    `)
})
