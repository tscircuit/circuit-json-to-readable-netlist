import { expect, it } from "bun:test"
import { getReadableNameForPin } from "lib/getReadableNameForPin"

it("does not emit Pinundefined when source_port lacks both name and pin_number", () => {
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
      port_hints: ["  ", "SDA"],
    },
  ] as any

  const readable = getReadableNameForPin({
    circuitJson,
    source_port_id: "source_port_0",
  })

  expect(readable).toBe("U1 Pin (SDA)")
  expect(readable).not.toContain("Pinundefined")
})
