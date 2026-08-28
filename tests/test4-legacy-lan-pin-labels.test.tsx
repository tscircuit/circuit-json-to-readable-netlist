import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

it("uses legacy LAN media labels as readable net names", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="soic8"
        manufacturerPartNumber="LEGACY_LAN_MEDIA"
        pinLabels={{
          pin1: ["ARCNET_TX1"],
          pin2: ["ARCNET_RX1"],
          pin3: ["TOKEN_RING_TX1"],
          pin4: ["TOKEN_RING_RX1"],
          pin5: ["ETH_AUI_COLL1"],
          pin6: ["AUI_LINK_TEST1"],
        }}
      />
      <resistor name="R1" resistance="1k" footprint="0402" />
      <resistor name="R2" resistance="1k" footprint="0402" />
      <resistor name="R3" resistance="1k" footprint="0402" />
      <resistor name="R4" resistance="1k" footprint="0402" />
      <resistor name="R5" resistance="1k" footprint="0402" />
      <resistor name="R6" resistance="1k" footprint="0402" />

      <trace from=".U1 .ARCNET_TX1" to=".R1 .pin1" />
      <trace from=".U1 .ARCNET_RX1" to=".R2 .pin1" />
      <trace from=".U1 .TOKEN_RING_TX1" to=".R3 .pin1" />
      <trace from=".U1 .TOKEN_RING_RX1" to=".R4 .pin1" />
      <trace from=".U1 .ETH_AUI_COLL1" to=".R5 .pin1" />
      <trace from=".U1 .AUI_LINK_TEST1" to=".R6 .pin1" />
    </board>,
  )

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_ARCNET_TX1")
  expect(netlist).toContain("NET: U1_ARCNET_RX1")
  expect(netlist).toContain("NET: U1_TOKEN_RING_TX1")
  expect(netlist).toContain("NET: U1_TOKEN_RING_RX1")
  expect(netlist).toContain("NET: U1_ETH_AUI_COLL1")
  expect(netlist).toContain("NET: U1_AUI_LINK_TEST1")
  expect(netlist).toContain("- pin1(ARCNET_TX1): NETS(U1_ARCNET_TX1)")
  expect(netlist).toContain("- pin6(AUI_LINK_TEST1): NETS(U1_AUI_LINK_TEST1)")
})
