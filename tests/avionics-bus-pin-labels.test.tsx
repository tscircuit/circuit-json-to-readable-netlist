import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

it("preserves avionics bus pin aliases in readable netlists", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="soic8"
        manufacturerPartNumber="HI-3593"
        pinLabels={{
          pin1: ["ARINC429_TX1"],
          pin2: ["ARINC429_RX1"],
          pin3: ["MIL1553_A"],
          pin4: ["SPACEWIRE_DOUT_P"],
        }}
      />
      <resistor resistance="1k" footprint="0402" name="R1" />
      <capacitor capacitance="1nF" footprint="0402" name="C1" />

      <trace from=".U1 .ARINC429_TX1" to=".R1 .pin1" />
      <trace from=".U1 .MIL1553_A" to=".C1 .pin1" />
    </board>,
  )

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_ARINC429_TX1")
  expect(netlist).toContain("  - U1 ARINC429_TX1")
  expect(netlist).toContain("NET: U1_MIL1553_A")
  expect(netlist).toContain("  - U1 MIL1553_A")
  expect(netlist).toContain("- pin1(ARINC429_TX1): NETS(U1_ARINC429_TX1)")
  expect(netlist).toContain("- pin3(MIL1553_A): NETS(U1_MIL1553_A)")
})
