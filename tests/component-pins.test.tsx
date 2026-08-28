import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

it("uses descriptive numbered chip labels in component pins", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        manufacturerPartNumber="RP2040"
        pinLabels={{
          pin14: ["GP10", "GPIO10", "SPI1_SCK"],
        }}
      />
    </board>,
  )
  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain(
    "- GP10(GPIO10, SPI1_SCK, pin14): NOT_CONNECTED",
  )
  expect(netlist).not.toContain("- pin14(GP10")
})

it("doesn't output undefined for passive component pin headers", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <resistor resistance="1k" name="R1" />
      <capacitor capacitance="1nF" name="C1" />
    </board>,
  )
  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).not.toContain("undefined")
})
