import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

it("preserves SFP/QSFP optical transceiver management pin labels", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="qfn16"
        manufacturerPartNumber="SFP-MGMT"
        pinLabels={{
          pin14: ["MOD_ABS"],
          pin15: ["RATE_SELECT"],
          pin16: ["RS1"],
        }}
      />
      <resistor resistance="10k" footprint="0402" name="R1" />
      <resistor resistance="10k" footprint="0402" name="R2" />
      <resistor resistance="10k" footprint="0402" name="R3" />

      <trace from=".U1 .MOD_ABS" to=".R1 .pin1" />
      <trace from=".U1 .RATE_SELECT" to=".R2 .pin1" />
      <trace from=".U1 .RS1" to=".R3 .pin1" />
    </board>,
  )

  for (const element of circuitJson) {
    if (element.type !== "source_port") continue
    if (element.port_hints?.includes("MOD_ABS")) element.name = "pin14"
    if (element.port_hints?.includes("RATE_SELECT")) element.name = "pin15"
    if (element.port_hints?.includes("RS1")) element.name = "pin16"
  }

  const readableNetlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(readableNetlist).toContain("NET: U1_MOD_ABS")
  expect(readableNetlist).toContain("  - U1 pin14 (MOD_ABS)")
  expect(readableNetlist).toContain("NET: U1_RATE_SELECT")
  expect(readableNetlist).toContain("  - U1 pin15 (RATE_SELECT)")
  expect(readableNetlist).toContain("NET: U1_RS1")
  expect(readableNetlist).toContain("  - U1 pin16 (RS1)")
})
