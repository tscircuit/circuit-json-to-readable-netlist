import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

it("preserves ham radio control aliases on generic chip pins", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="soic8"
        pinLabels={{
          pin1: ["pin14", "PTT_OUT1"],
          pin2: ["pin15", "SQUELCH1"],
          pin3: ["pin16", "CW_KEY1"],
        }}
      />
      <resistor resistance="1k" footprint="0402" name="R1" />
      <resistor resistance="1k" footprint="0402" name="R2" />
      <resistor resistance="1k" footprint="0402" name="R3" />

      <trace from=".U1 .PTT_OUT1" to=".R1 .pin1" />
      <trace from=".U1 .SQUELCH1" to=".R2 .pin1" />
      <trace from=".U1 .CW_KEY1" to=".R3 .pin1" />
    </board>,
  )

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_PTT_OUT1")
  expect(netlist).toContain("NET: U1_SQUELCH1")
  expect(netlist).toContain("NET: U1_CW_KEY1")
  expect(netlist).toContain("U1 pin14 (PTT_OUT1)")
  expect(netlist).toContain("U1 pin15 (SQUELCH1)")
  expect(netlist).toContain("U1 pin16 (CW_KEY1)")
})
