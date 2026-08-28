import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

it("preserves IO-Link HART and process-loop labels", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="qfn24"
        manufacturerPartNumber="MAX14828"
        pinLabels={{
          pin14: ["IOLINK_CQ1"],
          pin15: ["IO_LINK_WAKE1"],
          pin16: ["HART_TX1"],
          pin17: ["LOOP_4_20MA1"],
        }}
      />
      <resistor resistance="1k" footprint="0402" name="R1" />
      <resistor resistance="1k" footprint="0402" name="R2" />
      <resistor resistance="1k" footprint="0402" name="R3" />
      <resistor resistance="1k" footprint="0402" name="R4" />

      <trace from=".U1 .IOLINK_CQ1" to=".R1 > .pin1" />
      <trace from=".U1 .IO_LINK_WAKE1" to=".R2 > .pin1" />
      <trace from=".U1 .HART_TX1" to=".R3 > .pin1" />
      <trace from=".U1 .LOOP_4_20MA1" to=".R4 > .pin1" />
    </board>,
  )

  for (const [signalName, physicalPinName] of [
    ["IOLINK_CQ1", "pin14"],
    ["IO_LINK_WAKE1", "pin15"],
    ["HART_TX1", "pin16"],
    ["LOOP_4_20MA1", "pin17"],
  ]) {
    const port = circuitJson.find(
      (element) =>
        element.type === "source_port" && element.name === signalName,
    )
    if (port?.type === "source_port") {
      port.name = physicalPinName
      port.port_hints = [signalName]
    }
  }

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_IOLINK_CQ1")
  expect(netlist).toContain("  - U1 pin14 (IOLINK_CQ1)")
  expect(netlist).toContain("NET: U1_IO_LINK_WAKE1")
  expect(netlist).toContain("  - U1 pin15 (IO_LINK_WAKE1)")
  expect(netlist).toContain("NET: U1_HART_TX1")
  expect(netlist).toContain("  - U1 pin16 (HART_TX1)")
  expect(netlist).toContain("NET: U1_LOOP_4_20MA1")
  expect(netlist).toContain("  - U1 pin17 (LOOP_4_20MA1)")
})
