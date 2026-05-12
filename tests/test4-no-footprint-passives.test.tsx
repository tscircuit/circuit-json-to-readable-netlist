import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

it("passives without footprints do not render undefined", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <resistor name="R1" resistance="10k" />
      <capacitor name="C1" capacitance="100nF" />
    </board>,
  )

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)
  expect(netlist).not.toContain("undefined")
  expect(netlist).toContain(" - R1: 10k resistor")
  expect(netlist).toContain(" - C1: 100nF capacitor")
  expect(netlist).toContain("R1 (10k)")
  expect(netlist).toContain("C1 (100nF)")
})
