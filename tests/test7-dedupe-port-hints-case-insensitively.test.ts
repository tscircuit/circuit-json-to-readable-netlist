import { expect, it } from "bun:test"
import { getReadableNameForPin } from "lib/getReadableNameForPin"

it("deduplicates equivalent port hints regardless of case", () => {
  const circuitJson = [
    {
      type: "source_component",
      source_component_id: "source_component_0",
      name: "U1",
      ftype: "simple_chip",
    },
    {
      type: "source_port",
      source_port_id: "source_port_0",
      source_component_id: "source_component_0",
      name: "pin14",
      pin_number: 14,
      port_hints: ["SDA", "sda", " SDA "],
    },
  ] as any

  const readable = getReadableNameForPin({
    circuitJson,
    source_port_id: "source_port_0",
  })

  expect(readable).toBe("U1 pin14 (SDA)")
})
