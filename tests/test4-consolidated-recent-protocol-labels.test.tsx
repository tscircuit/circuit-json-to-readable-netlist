import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { scorePhrase } from "lib/scorePhrase"
import { renderCircuit } from "tests/fixtures/render-circuit"

const consolidatedProtocolLabels = [
  "HDQ_DATA1",
  "SDQ_DATA1",
  "BQ274_INT1",
  "BQ275_BAT_LOW1",
  "FUEL_GAUGE_ALERT1",
  "GAUGE_WAKE1",
  "MDIO_DATA1",
  "MDC_CLK1",
  "PHYAD0",
  "PHY_INT1",
  "PHY_RST1",
  "ETH_PHY_RESET1",
  "DMX512_DATA_P1",
  "DMX512_DATA_N1",
  "DMX_BREAK1",
  "RDM_DIR1",
  "DALI_BUS1",
  "DALI_TX1",
  "ARINC429_TX1",
  "ARINC_RX1",
  "A429_LABEL1",
  "MIL1553_TXP1",
  "M1553_RXN1",
  "1553B_STUB1",
  "SENT_OUT1",
  "SENT_RX1",
  "SENT_TX1",
  "SPC_TRIG1",
  "PSI5_BUS1",
  "PSI5_SYNC1",
]

it("test4 should score recent protocol label families before numeric fallback", () => {
  for (const label of consolidatedProtocolLabels) {
    expect(scorePhrase(label)).toBe(1.25)
  }

  expect(scorePhrase("pin14")).toBe(0.5)
})

it("test4 should preserve consolidated recent protocol labels", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="qfn24"
        manufacturerPartNumber="RECENT-PROTO"
        pinLabels={{
          pin1: ["HDQ_DATA1"],
          pin2: ["SDQ_DATA1"],
          pin3: ["FUEL_GAUGE_ALERT1"],
          pin4: ["MDIO_DATA1"],
          pin5: ["MDC_CLK1"],
          pin6: ["PHYAD0"],
          pin7: ["DMX512_DATA_P1"],
          pin8: ["RDM_DIR1"],
          pin9: ["DALI_BUS1"],
          pin10: ["ARINC429_TX1"],
          pin11: ["MIL1553_TXP1"],
          pin12: ["M1553_RXN1"],
          pin13: ["SENT_OUT1"],
          pin14: ["SPC_TRIG1"],
          pin15: ["PSI5_BUS1"],
        }}
      />
      <resistor resistance="1k" footprint="0402" name="R1" />
      <resistor resistance="1k" footprint="0402" name="R2" />
      <resistor resistance="1k" footprint="0402" name="R3" />
      <resistor resistance="1k" footprint="0402" name="R4" />
      <resistor resistance="1k" footprint="0402" name="R5" />
      <resistor resistance="1k" footprint="0402" name="R6" />
      <resistor resistance="1k" footprint="0402" name="R7" />
      <resistor resistance="1k" footprint="0402" name="R8" />
      <resistor resistance="1k" footprint="0402" name="R9" />
      <resistor resistance="1k" footprint="0402" name="R10" />
      <resistor resistance="1k" footprint="0402" name="R11" />
      <resistor resistance="1k" footprint="0402" name="R12" />
      <resistor resistance="1k" footprint="0402" name="R13" />
      <resistor resistance="1k" footprint="0402" name="R14" />
      <resistor resistance="1k" footprint="0402" name="R15" />

      <trace from=".U1 .HDQ_DATA1" to=".R1 > .pin1" />
      <trace from=".U1 .SDQ_DATA1" to=".R2 > .pin1" />
      <trace from=".U1 .FUEL_GAUGE_ALERT1" to=".R3 > .pin1" />
      <trace from=".U1 .MDIO_DATA1" to=".R4 > .pin1" />
      <trace from=".U1 .MDC_CLK1" to=".R5 > .pin1" />
      <trace from=".U1 .PHYAD0" to=".R6 > .pin1" />
      <trace from=".U1 .DMX512_DATA_P1" to=".R7 > .pin1" />
      <trace from=".U1 .RDM_DIR1" to=".R8 > .pin1" />
      <trace from=".U1 .DALI_BUS1" to=".R9 > .pin1" />
      <trace from=".U1 .ARINC429_TX1" to=".R10 > .pin1" />
      <trace from=".U1 .MIL1553_TXP1" to=".R11 > .pin1" />
      <trace from=".U1 .M1553_RXN1" to=".R12 > .pin1" />
      <trace from=".U1 .SENT_OUT1" to=".R13 > .pin1" />
      <trace from=".U1 .SPC_TRIG1" to=".R14 > .pin1" />
      <trace from=".U1 .PSI5_BUS1" to=".R15 > .pin1" />
    </board>,
  )

  const readableNetlist = convertCircuitJsonToReadableNetlist(circuitJson)

  for (const label of [
    "HDQ_DATA1",
    "SDQ_DATA1",
    "FUEL_GAUGE_ALERT1",
    "MDIO_DATA1",
    "MDC_CLK1",
    "PHYAD0",
    "DMX512_DATA_P1",
    "RDM_DIR1",
    "DALI_BUS1",
    "ARINC429_TX1",
    "MIL1553_TXP1",
    "M1553_RXN1",
    "SENT_OUT1",
    "SPC_TRIG1",
    "PSI5_BUS1",
  ]) {
    expect(readableNetlist).toContain(`NET: U1_${label}`)
    expect(readableNetlist).toContain(`NETS(U1_${label})`)
  }

  expect(readableNetlist).not.toContain("NET: U1_pin")
})
