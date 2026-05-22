import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import type { AnyCircuitElement } from "circuit-json"

const rawCircuitJson = [
  {
    type: "source_component",
    ftype: "simple_chip",
    source_component_id: "source_component_0",
    name: "U1",
    manufacturer_part_number: "MCU",
  },
  {
    type: "source_component",
    ftype: "simple_resistor",
    source_component_id: "source_component_1",
    name: "R1",
    display_resistance: "10kΩ",
  },
  {
    type: "source_port",
    source_port_id: "source_port_0",
    source_component_id: "source_component_0",
    name: "pin14",
    pin_number: 14,
    port_hints: ["pin14", "GPIO0", "ADC0"],
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
] as AnyCircuitElement[]

it("uses full chip pin labels in readable nets and omits undefined footprints", () => {
  const netlist = convertCircuitJsonToReadableNetlist(rawCircuitJson)

  expect(netlist).not.toContain("undefined")
  expect(netlist).toContain("U1 pin14 (GPIO0, ADC0)")
  expect(netlist).toContain("R1 (10kΩ)")
  expect(netlist).toMatchInlineSnapshot(`
    "COMPONENTS:
     - U1: MCU
     - R1: 10kΩ resistor

    NET: U1_GPIO0
      - U1 pin14 (GPIO0, ADC0)
      - R1 pin1


    COMPONENT_PINS:
    U1 (MCU)
    - pin14(GPIO0, ADC0): NETS(U1_GPIO0)

    R1 (10kΩ)
    - pin1(left): NETS(U1_GPIO0)
    "
  `)
})
