import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

it("shows useful chip labels when source pins have generic pin names", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="soic16"
        pinLabels={{
          pin14: ["GPIO14"],
        }}
      />
      <resistor resistance="1k" footprint="0402" name="R1" />
      <trace from=".U1 .GPIO14" to=".R1 .pin1" />
    </board>,
  )

  const sourcePort = circuitJson.find(
    (element) => element.type === "source_port" && element.name === "GPIO14",
  )
  if (!sourcePort || sourcePort.type !== "source_port") {
    throw new Error("Expected rendered GPIO14 source port")
  }

  sourcePort.name = "pin14"
  sourcePort.port_hints = ["GPIO14", "pin14", "14"]

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_GPIO14")
  expect(netlist).toContain("  - U1 pin14 (GPIO14)")
  expect(netlist).toContain("- pin14(GPIO14): NETS(U1_GPIO14)")
})
