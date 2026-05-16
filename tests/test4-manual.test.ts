import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"

it("test4 manual circuit json (bypassing render bug)", () => {
  const circuitJson: any[] = [
    {
      type: "source_component",
      source_component_id: "u1",
      name: "U1",
      ftype: "chip",
    },
    {
      type: "source_port",
      source_port_id: "u1_p1",
      source_component_id: "u1",
      name: "GP14",
      pin_number: 1,
      port_hints: ["GP14", "D1"],
    },
    {
      type: "source_component",
      source_component_id: "u2",
      name: "U2",
      ftype: "chip",
    },
    {
      type: "source_port",
      source_port_id: "u2_p1",
      source_component_id: "u2",
      name: "GP15",
      pin_number: 1,
    },
    {
      type: "source_net",
      source_net_id: "net1",
      name: "GND",
    },
    {
      type: "source_trace",
      source_trace_id: "t1",
      connected_source_port_ids: ["u1_p1", "u2_p1"],
      connected_source_net_ids: ["net1"],
    },
  ]

  const output = convertCircuitJsonToReadableNetlist(circuitJson)
  console.log(output)

  // Check if the pin aliases (labels) are included in the output
  expect(output).toContain("- pin1(GP14, D1): NOT_CONNECTED")
})
