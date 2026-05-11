import { expect, it } from "bun:test"
import type { AnyCircuitElement } from "circuit-json"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"

declare module "bun:test" {
  interface Matchers<T = unknown> {
    toMatchInlineSnapshot(snapshot?: string | null): Promise<MatcherResult>
  }
}

it("unnamed unnumbered ports on named nets do not output undefined", () => {
  const circuitJson = [
    {
      type: "source_component",
      source_component_id: "source_component_1",
      name: "U1",
      ftype: "simple_chip",
      manufacturer_part_number: "TEST_CHIP",
    },
    {
      type: "source_port",
      source_port_id: "source_port_1",
      source_component_id: "source_component_1",
      port_hints: [],
    },
    {
      type: "source_net",
      source_net_id: "source_net_1",
      name: "RESET",
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_1",
      connected_source_port_ids: ["source_port_1"],
      connected_source_net_ids: ["source_net_1"],
    },
  ] as AnyCircuitElement[]

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).not.toContain("undefined")
  expect(netlist).toMatchInlineSnapshot(`
    "COMPONENTS:
     - U1: TEST_CHIP


    EMPTY NET PINS:
      - U1 unnamed pin

    COMPONENT_PINS:
    U1 (TEST_CHIP)
    - unnamed_pin: NETS(RESET)
    "
  `)
})
