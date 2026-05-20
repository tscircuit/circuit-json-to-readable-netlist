import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { scorePhrase } from "lib/scorePhrase"
import { renderCircuit } from "tests/fixtures/render-circuit"

it("preserves PON optical access aliases on generic chip pins", () => {
  expect(scorePhrase("PON_TX_DISABLE1")).toBeGreaterThan(scorePhrase("pos"))
  expect(scorePhrase("GPON_BURST_EN1")).toBeGreaterThan(scorePhrase("pos"))
  expect(scorePhrase("EPON_RX_LOS1")).toBeGreaterThan(scorePhrase("pos"))
  expect(scorePhrase("ONU_RESET1")).toBeGreaterThan(scorePhrase("pos"))
  expect(scorePhrase("BOSA_RX1")).toBeGreaterThan(scorePhrase("pos"))

  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="qfn32"
        manufacturerPartNumber="PON_ONU"
        pinLabels={{
          pin1: ["pin14", "PON_TX_DISABLE1"],
          pin2: ["pin15", "GPON_BURST_EN1"],
          pin3: ["pin16", "EPON_RX_LOS1"],
        }}
      />
      <resistor resistance="1k" footprint="0402" name="R1" />
      <capacitor capacitance="1nF" footprint="0402" name="C1" />

      <trace from=".U1 .pin14" to=".R1 .pin1" />
      <trace from=".U1 .pin15" to=".C1 .pin1" />
      <trace from=".U1 .pin16" to=".R1 .pin2" />
    </board>,
  )

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_PON_TX_DISABLE1")
  expect(netlist).toContain("NET: U1_GPON_BURST_EN1")
  expect(netlist).toContain("NET: U1_EPON_RX_LOS1")
  expect(netlist).toContain("  - U1 pin14 (PON_TX_DISABLE1)")
  expect(netlist).toContain("  - U1 pin15 (GPON_BURST_EN1)")
  expect(netlist).toContain("  - U1 pin16 (EPON_RX_LOS1)")
  expect(netlist).toContain(
    "- pin1(pin14, PON_TX_DISABLE1): NETS(U1_PON_TX_DISABLE1)",
  )
  expect(netlist).toContain(
    "- pin2(pin15, GPON_BURST_EN1): NETS(U1_GPON_BURST_EN1)",
  )
  expect(netlist).toContain(
    "- pin3(pin16, EPON_RX_LOS1): NETS(U1_EPON_RX_LOS1)",
  )
})
