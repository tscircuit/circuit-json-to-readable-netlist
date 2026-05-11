import { expect, it } from "bun:test"
import { getReadableNameForPin } from "lib/getReadableNameForPin"

declare module "bun:test" {
  interface Matchers<T = unknown> {
    toMatchInlineSnapshot(snapshot?: string | null): Promise<MatcherResult>
  }
}

it("keeps meaningful pin labels that contain digits", () => {
  const readablePinName = getReadableNameForPin({
    source_port_id: "source_port_1",
    circuitJson: [
      {
        type: "source_component",
        source_component_id: "source_component_1",
        name: "U1",
        ftype: "simple_chip",
      },
      {
        type: "source_port",
        source_port_id: "source_port_1",
        source_component_id: "source_component_1",
        name: "pin14",
        pin_number: 14,
        port_hints: ["pin14", "GPIO2", "SDA"],
      },
    ],
  })

  expect(readablePinName).toBe("U1 pin14 (GPIO2,SDA)")
})
