import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"

declare module "bun:test" {
  interface Matchers<T = unknown> {
    toMatchInlineSnapshot(snapshot?: string | null): Promise<MatcherResult>
  }
}

it("passives missing display values don't output undefined", () => {
  const circuitJson = [
    {
      type: "source_component",
      source_component_id: "source_component_r1",
      ftype: "simple_resistor",
      name: "R1",
    },
    {
      type: "source_component",
      source_component_id: "source_component_c1",
      ftype: "simple_capacitor",
      name: "C1",
    },
    {
      type: "cad_component",
      cad_component_id: "cad_component_r1",
      source_component_id: "source_component_r1",
      footprinter_string: "0402",
    },
    {
      type: "cad_component",
      cad_component_id: "cad_component_c1",
      source_component_id: "source_component_c1",
      footprinter_string: "0603",
    },
    {
      type: "source_port",
      source_port_id: "source_port_r1_1",
      source_component_id: "source_component_r1",
      name: "pin1",
      pin_number: 1,
      port_hints: ["pin1", "1", "left"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_c1_1",
      source_component_id: "source_component_c1",
      name: "pin1",
      pin_number: 1,
      port_hints: ["pin1", "1", "pos"],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_0",
      connected_source_port_ids: ["source_port_r1_1", "source_port_c1_1"],
      connected_source_net_ids: [],
    },
  ] as any

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).not.toContain("undefined")
  expect(netlist).toMatchInlineSnapshot(`
    "COMPONENTS:
     - R1: 0402 resistor
     - C1: 0603 capacitor

    NET: C1_pos
      - R1 pin1
      - C1 pin1 (+)


    COMPONENT_PINS:
    R1 (0402)
    - pin1(left): NETS(C1_pos)

    C1 (0603)
    - pin1(pos): NETS(C1_pos)
    "
  `)
})
