import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

it("test4 should preserve MDIO and Ethernet PHY management labels", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="qfn32"
        manufacturerPartNumber="KSZ9031"
        pinLabels={{
          pin1: ["MDIO_DATA1"],
          pin2: ["MDC_CLK1"],
          pin3: ["PHYAD0"],
          pin4: ["PHY_INT1"],
          pin5: ["PHY_RST1"],
          pin6: ["ETH_PHY_RESET1"],
        }}
      />
      <resistor resistance="1k" footprint="0402" name="R1" />
      <resistor resistance="1k" footprint="0402" name="R2" />
      <resistor resistance="1k" footprint="0402" name="R3" />
      <resistor resistance="1k" footprint="0402" name="R4" />
      <resistor resistance="1k" footprint="0402" name="R5" />
      <resistor resistance="1k" footprint="0402" name="R6" />

      <trace from=".U1 .MDIO_DATA1" to=".R1 > .pin1" />
      <trace from=".U1 .MDC_CLK1" to=".R2 > .pin1" />
      <trace from=".U1 .PHYAD0" to=".R3 > .pin1" />
      <trace from=".U1 .PHY_INT1" to=".R4 > .pin1" />
      <trace from=".U1 .PHY_RST1" to=".R5 > .pin1" />
      <trace from=".U1 .ETH_PHY_RESET1" to=".R6 > .pin1" />
    </board>,
  )

  const readableNetlist = convertCircuitJsonToReadableNetlist(circuitJson)

  for (const label of [
    "MDIO_DATA1",
    "MDC_CLK1",
    "PHYAD0",
    "PHY_INT1",
    "PHY_RST1",
    "ETH_PHY_RESET1",
  ]) {
    expect(readableNetlist).toContain(`NET: U1_${label}`)
    expect(readableNetlist).toContain(`NETS(U1_${label})`)
  }

  expect(readableNetlist).not.toContain("NET: U1_pin")
})
