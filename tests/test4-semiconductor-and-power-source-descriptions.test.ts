import { expect, it } from "bun:test"
import type { AnyCircuitElement } from "circuit-json"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"

declare module "bun:test" {
  interface Matchers<T = unknown> {
    toMatchInlineSnapshot(snapshot?: string | null): Promise<MatcherResult>
  }
}

it("renders readable semiconductor and power source descriptions", () => {
  const circuitJson: AnyCircuitElement[] = [
    {
      type: "source_component",
      ftype: "simple_mosfet",
      source_component_id: "source_component_0",
      name: "Q1",
      channel_type: "n",
      mosfet_mode: "enhancement",
    },
    {
      type: "source_component",
      ftype: "simple_transistor",
      source_component_id: "source_component_1",
      name: "Q2",
      transistor_type: "pnp",
    },
    {
      type: "source_component",
      ftype: "simple_power_source",
      source_component_id: "source_component_2",
      name: "V1",
      voltage: 3.3,
    },
  ]

  expect(
    convertCircuitJsonToReadableNetlist(circuitJson),
  ).toMatchInlineSnapshot(`
    "COMPONENTS:
     - Q1: N-channel enhancement MOSFET
     - Q2: PNP transistor
     - V1: 3.3V power source


    COMPONENT_PINS:
    Q1 (N-channel enhancement MOSFET)

    Q2 (PNP transistor)

    V1 (3.3V)
    "
  `)
})

