import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

it("preserves crypto accelerator and entropy-source labels", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="qfn32"
        manufacturerPartNumber="ATECC608B"
        pinLabels={{
          pin14: ["TRNG1_RDY"],
          pin15: ["AES_DONE"],
          pin16: ["HMAC_IRQ"],
          pin17: ["PUF_READY"],
        }}
      />
      <resistor resistance="1k" footprint="0402" name="R1" />
      <resistor resistance="1k" footprint="0402" name="R2" />
      <resistor resistance="1k" footprint="0402" name="R3" />
      <resistor resistance="1k" footprint="0402" name="R4" />

      <trace from=".U1 .TRNG1_RDY" to=".R1 > .pin1" />
      <trace from=".U1 .AES_DONE" to=".R2 > .pin1" />
      <trace from=".U1 .HMAC_IRQ" to=".R3 > .pin1" />
      <trace from=".U1 .PUF_READY" to=".R4 > .pin1" />
    </board>,
  )

  for (const [signalName, physicalPinName] of [
    ["TRNG1_RDY", "pin14"],
    ["AES_DONE", "pin15"],
    ["HMAC_IRQ", "pin16"],
    ["PUF_READY", "pin17"],
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

  expect(netlist).toContain("NET: U1_TRNG1_RDY")
  expect(netlist).toContain("  - U1 pin14 (TRNG1_RDY)")
  expect(netlist).toContain("NET: U1_AES_DONE")
  expect(netlist).toContain("  - U1 pin15 (AES_DONE)")
  expect(netlist).toContain("NET: U1_HMAC_IRQ")
  expect(netlist).toContain("  - U1 pin16 (HMAC_IRQ)")
  expect(netlist).toContain("NET: U1_PUF_READY")
  expect(netlist).toContain("  - U1 pin17 (PUF_READY)")
})
