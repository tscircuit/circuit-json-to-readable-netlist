import { expect, it } from "bun:test"
import type { CircuitJson } from "circuit-json"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"

declare module "bun:test" {
  interface Matchers<T = unknown> {
    toMatchInlineSnapshot(snapshot?: string | null): Promise<MatcherResult>
  }
}

it("preserves Wiegand access-control pin labels", () => {
  const circuitJson = [
    {
      type: "source_component",
      source_component_id: "source_component_1",
      ftype: "simple_chip",
      name: "U1",
      manufacturer_part_number: "RP2040",
    },
    {
      type: "source_component",
      source_component_id: "source_component_2",
      ftype: "simple_chip",
      name: "J1",
      manufacturer_part_number: "WiegandReaderHeader",
    },
    {
      type: "cad_component",
      cad_component_id: "cad_component_1",
      source_component_id: "source_component_1",
      footprinter_string: "soic8",
    },
    {
      type: "cad_component",
      cad_component_id: "cad_component_2",
      source_component_id: "source_component_2",
      footprinter_string: "pinrow2",
    },
    {
      type: "source_port",
      source_port_id: "source_port_1",
      source_component_id: "source_component_1",
      name: "GPIO1",
      pin_number: 1,
      port_hints: ["1", "GPIO1", "WIEGAND_D0"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_2",
      source_component_id: "source_component_1",
      name: "GPIO2",
      pin_number: 2,
      port_hints: ["2", "GPIO2", "WG_D1"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_3",
      source_component_id: "source_component_2",
      name: "DATA0",
      pin_number: 1,
      port_hints: ["1", "DATA0"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_4",
      source_component_id: "source_component_2",
      name: "DATA1",
      pin_number: 2,
      port_hints: ["2", "DATA1"],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_1",
      connected_source_port_ids: ["source_port_1", "source_port_3"],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_2",
      connected_source_port_ids: ["source_port_2", "source_port_4"],
    },
  ] as CircuitJson

  expect(
    convertCircuitJsonToReadableNetlist(circuitJson),
  ).toMatchInlineSnapshot(`
    "COMPONENTS:
     - U1: RP2040, soic8
     - J1: WiegandReaderHeader, pinrow2

    NET: U1_WIEGAND_D0
      - U1 GPIO1 (WIEGAND_D0)
      - J1 DATA0

    NET: U1_WG_D1
      - U1 GPIO2 (WG_D1)
      - J1 DATA1


    COMPONENT_PINS:
    U1 (RP2040)
    - pin1(GPIO1, WIEGAND_D0): NETS(U1_WIEGAND_D0)
    - pin2(GPIO2, WG_D1): NETS(U1_WG_D1)

    J1 (WiegandReaderHeader)
    - pin1(DATA0): NETS(U1_WIEGAND_D0)
    - pin2(DATA1): NETS(U1_WG_D1)
    "
  `)
})
