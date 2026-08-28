import { expect, it } from "bun:test"
import { generateNetName } from "lib/generateNetName"

it("ignores empty source-net names when generating fallback names", () => {
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
      port_hints: ["GPIO1"],
    },
    {
      type: "source_net",
      source_net_id: "source_net_0",
      name: "   ",
    },
  ] as any

  const netName = generateNetName({
    circuitJson,
    connectedIds: ["source_port_0", "source_net_0"],
  })

  expect(netName).toBe("U1_pin14")
  expect(netName).not.toContain(" ")
})
