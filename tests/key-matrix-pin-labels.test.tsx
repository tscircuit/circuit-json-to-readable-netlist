import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

it("scores keypad and key-matrix pin labels", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="qfn32"
        manufacturerPartNumber="KEYSCAN-CTRL"
        pinLabels={{
          pin1: ["pin14", "KEY_ROW1"],
          pin2: ["pin15", "KEY_COL1"],
          pin3: ["pin16", "KSCAN_IN1"],
          pin4: ["pin17", "KBD_WAKE1"],
        }}
      />
      <resistor resistance="10k" footprint="0402" name="R1" />
      <capacitor capacitance="100nF" footprint="0402" name="C1" />

      <trace from=".U1 .KEY_ROW1" to=".R1 > .pin1" />
      <trace from=".U1 .KEY_COL1" to=".R1 > .pin2" />
      <trace from=".U1 .KSCAN_IN1" to=".C1 > .pin1" />
      <trace from=".U1 .KBD_WAKE1" to=".C1 > .pin2" />
    </board>,
  )

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_KEY_ROW1")
  expect(netlist).toContain("  - U1 pin14 (KEY_ROW1)")
  expect(netlist).toContain("- pin1(pin14, KEY_ROW1): NETS(U1_KEY_ROW1)")

  expect(netlist).toContain("NET: U1_KEY_COL1")
  expect(netlist).toContain("  - U1 pin15 (KEY_COL1)")

  expect(netlist).toContain("NET: U1_KSCAN_IN1")
  expect(netlist).toContain("  - U1 pin16 (KSCAN_IN1)")

  expect(netlist).toContain("NET: U1_KBD_WAKE1")
  expect(netlist).toContain("  - U1 pin17 (KBD_WAKE1)")
  expect(netlist).toContain("- pin4(pin17, KBD_WAKE1): NETS(U1_KBD_WAKE1)")
})
