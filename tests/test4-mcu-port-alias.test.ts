import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"

it("uses MCU port aliases before low-information numbered pin labels", () => {
  const netlist = convertCircuitJsonToReadableNetlist([
    {
      type: "source_component",
      ftype: "simple_chip",
      name: "U1",
      source_component_id: "source_component_0",
      manufacturer_part_number: "STM32F103",
    },
    {
      type: "source_port",
      source_port_id: "source_port_0",
      source_component_id: "source_component_0",
      name: "pin14",
      pin_number: 14,
      port_hints: ["PA0"],
    },
    {
      type: "source_component",
      ftype: "simple_resistor",
      name: "R1",
      source_component_id: "source_component_1",
      resistance: 1000,
      display_resistance: "1k",
    },
    {
      type: "cad_component",
      cad_component_id: "cad_component_1",
      pcb_component_id: "pcb_component_1",
      source_component_id: "source_component_1",
      footprinter_string: "0402",
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
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
      type: "source_trace",
      source_trace_id: "source_trace_0",
      connected_source_port_ids: ["source_port_0", "source_port_1"],
      connected_source_net_ids: [],
    },
  ])

  expect(netlist).toMatchInlineSnapshot(`
    "COMPONENTS:
     - U1: STM32F103
     - R1: 1k 0402 resistor

    NET: U1_PA0
      - U1 pin14 (PA0)
      - R1 pin1


    COMPONENT_PINS:
    U1 (STM32F103)
    - pin14(PA0): NETS(U1_PA0)

    R1 (1k 0402)
    - pin1(pos): NETS(U1_PA0)
    "
  `)
})
