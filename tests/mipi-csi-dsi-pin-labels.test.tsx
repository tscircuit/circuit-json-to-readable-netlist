import { expect, it } from "bun:test"
import type { SourcePort } from "circuit-json"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

it("uses MIPI CSI/DSI labels for generic numbered pins", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="soic8"
        manufacturerPartNumber="CAM_IF"
        pinLabels={{
          pin1: ["MIPI_CSI_D0_P"],
        }}
      />
      <capacitor capacitance="1nF" footprint="0402" name="C1" />

      <trace from=".U1 .MIPI_CSI_D0_P" to=".C1 > .pin1" />
    </board>,
  )

  const mipiPort = circuitJson.find(
    (element): element is SourcePort =>
      element.type === "source_port" &&
      element.port_hints?.includes("MIPI_CSI_D0_P") === true,
  )
  if (!mipiPort) {
    throw new Error("Expected rendered circuit to include the MIPI source port")
  }

  mipiPort.name = "pin1"
  mipiPort.port_hints = ["pin1", "1", "MIPI_CSI_D0_P"]

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_MIPI_CSI_D0_P")
  expect(netlist).toContain("  - U1 pin1 (MIPI_CSI_D0_P)")
  expect(netlist).toContain("- pin1(MIPI_CSI_D0_P): NETS(U1_MIPI_CSI_D0_P)")
})
